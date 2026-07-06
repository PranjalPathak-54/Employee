import employeeModel from "../models/Employee.js";
import bcrypt from 'bcrypt'
import userModel from "../models/User.js";
export const createEmployee = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, position, department, basicSalary, allowances, deductions, joinDate, password, role, bio } = req.body
        console.log('createEmployee body:', req.body)
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ error: "Missing required field" })
        }
        const existingUser = await userModel.findOne({ email })
        const existingEmployee = await employeeModel.findOne({ email })
        if (existingUser || existingEmployee) {
            return res.status(400).json({ error: "Email Already exists" })
        }
        const hashed = await bcrypt.hash(password, 10)
        const user = await userModel.create({
            email,
            password: hashed,
            role: role || "EMPLOYEE"
        })
        try {
            const employee = await employeeModel.create({
                userId: user._id,
                firstName,
                lastName,
                email,
                phone,
                position,
                department: department || "Engineering",
                basicSalary: Number(basicSalary) || 0,
                allowances: Number(allowances) || 0,
                deductions: Number(deductions) || 0,
                joinDate: new Date(joinDate),
                bio: bio || ""
            })
            return res.status(201).json({ success: true, employee })
        } catch (empError) {
            await userModel.findByIdAndDelete(user._id)
            throw empError
        }
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: "Email Already exists" })
        }
        console.error("Create employee error", error)
        return res.status(500).json({ error: "Failed To Create Employee" })
    }
}

export const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params
        const { firstName, lastName, email, phone, position, department, basicSalary, allowances, deductions, password, role, bio, employmentStatus } = req.body
        if (!email || !firstName || !lastName) {
            return res.status(400).json({ error: "Missing required field" })
        }
        const employee = await employeeModel.findById(id)
        if (!employee) return res.status(404).json({ error: "Employee Not Found" })

        await employeeModel.findByIdAndUpdate(id, {
            firstName,
            lastName,
            email,
            phone,
            position,
            department: department || "Engineering",
            basicSalary: Number(basicSalary) || 0,
            allowances: Number(allowances) || 0,
            deductions: Number(deductions) || 0,
            employmentStatus: employmentStatus || "ACTIVE",
            bio: bio || ""
        })
        const userUpdate = { email }
        if (role) userUpdate.role = role
        if (password) userUpdate.password = await bcrypt.hash(password, 10)
        await userModel.findByIdAndUpdate(employee.userId, userUpdate)
        return res.status(201).json({ success: true, employee })
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: "Email Already exists" })
        }
        console.error("Create employee error", error)
        return res.status(500).json({ error: "Failed To Update Employee" })
    }
}

export const getEmployee = async (req, res) => {
    try {
        const { department } = req.query;
        const where = { isDeleted: false }
        if (department) where.department = department
        const employees = await employeeModel.find(where).sort({ createdAt: -1 }).populate("userId", "email role").lean()
        const result = employees.map((emp) => ({
            ...emp,
            id: emp._id.toString(),
            user: emp.userId ? { email: emp.userId.email, role: emp.userId.role } : null
        }))
        return res.json(result)
    }
    catch (error) {
        console.error("Get employees error", error)
        return res.status(500).json({ error: "Failed to fetch employees" })
    }
}

export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params
        const employee = await employeeModel.findById(id)
        if (!employee) return res.status(404).json({ error: "Employee Not Found" })
        employee.isDeleted = true
        employee.employmentStatus = 'INACTIVE'
        await employee.save()
        return res.json({ success: true })
    }
    catch(error){
        return res.status(500).json({error:"Failed To Delete Employee"})
    }
}