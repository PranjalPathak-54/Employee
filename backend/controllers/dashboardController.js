import attendance from "../models/Attendance.js"
import employeeModel from "../models/Employee.js"
import LeaveApplication from "../models/LeaveApplication.js"
import PayslipModel from "../models/Payslips.js"
import { DEPARTMENTS } from "../constants/departments.js"

export const getDashboard = async (req, res) => {
    try {
        const session = req.session
        if (!session) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        if (session.role === "ADMIN") {
            const [totalEmployees, todayAttendance, pendingLeaves] = await Promise.all([
                employeeModel.countDocuments({ isDeleted: { $ne: true } }),
                attendance.countDocuments({
                    date: {
                        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        $lt: new Date(new Date().setHours(24, 0, 0, 0)),
                    },
                }),
                LeaveApplication.countDocuments({ status: "PENDING" }),
            ])

            return res.json({
                role: "ADMIN",
                totalEmployees,
                totalDepartments: DEPARTMENTS.length,
                todayAttendance,
                pendingLeaves,
            })
        }

        const employee = await employeeModel.findOne({ userId: session.userId }).lean()
        if (!employee) return res.status(404).json({ error: "Employee Not Found" })

        const today = new Date()
        const [currentMonthAttendance, pendingLeaves, latestPayslip] = await Promise.all([
            attendance.countDocuments({
                employeeId: employee._id,
                date: {
                    $gte: new Date(today.getFullYear(), today.getMonth(), 1),
                    $lt: new Date(today.getFullYear(), today.getMonth() + 1, 1),
                },
            }),
            LeaveApplication.countDocuments({
                employeeId: employee._id,
                status: "PENDING",
            }),
            PayslipModel.findOne({ employeeId: employee._id }).sort({ createdAt: -1 }).lean(),
        ])

        return res.json({
            role: "EMPLOYEE",
            employee: { ...employee, id: employee._id.toString() },
            currentMonthAttendance,
            pendingLeaves,
            latestPayslip: latestPayslip ? { ...latestPayslip, id: latestPayslip._id.toString() } : null,
        })
    } catch (error) {
        console.error("Dashboard error", error)
        return res.status(500).json({ error: "Failed" })
    }
}