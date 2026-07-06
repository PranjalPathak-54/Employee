import employeeModel from "../models/Employee.js"
import payslip from "../models/Payslips.js"

export const createPayslip = async (req, res) => {
    try {
        const { employeeId, month, year, basicSalary, allowances, deductions } = req.body
        if (!employeeId || !month || !year || !basicSalary) {
            return res.status(400).json({ error: "Missing fields" })
        }
        const netSalary = Number(basicSalary) + Number(allowances || 0) - Number(deductions || 0)
        const newPayslip = await payslip.create({
            employeeId,
            month: Number(month),
            year: Number(year),
            basicSalary: Number(basicSalary),
            allowances: Number(allowances || 0),
            deductions: Number(deductions || 0),
            netSalary,
        })
        return res.json({ success: true, data: newPayslip })
    }
    catch (error) {
        return res.status(500).json({ error: "Failed" })
    }
}

export const getPayslips = async (req, res) => {
    try {
        const session = req.session
        const isAdmin = session.role === 'ADMIN'
        if (isAdmin) {
            const payslips = await payslip.find().populate("employeeId").sort({ createdAt: -1 })
            const data = payslips.map((p) => {
                const obj = p.toObject()
                return {
                    ...obj,
                    id: obj._id.toString(),
                    employee: obj.employeeId,
                    employeeId: obj.employeeId?._id?.toString(),
                }
            })
            return res.json({ data })
        }
        else {
            const employee = await employeeModel.findOne({ userId: session.userId })
            if (!employee) return res.status(404).json({ error: "Not Found" })
            const payslips = await payslip.find({ employeeId: employee._id }).sort({ createdAt: -1 })
            return res.json({ data: payslips })
        }
    }
    catch (error) {
        return res.status(500).json({ error: "Failed" })
    }
}

export const getPayslipsById=async(req,res)=>{
    try{
        const payslips=await payslip.findById(req.params.id).populate("employeeId").lean()
        if(!payslips) return res.status(404).json({error:"Not Found"})
        const result={
          ...payslips,
            id:payslips._id.toString(),
          employee:payslips.employeeId,
        }
        return res.json(result)
    }
    catch(error){
        return res.status(500).json({error:"Failed"})
    }
}