import employeeModel from "../models/Employee.js"

export const getProfile = async (req, res) => {
    try {
        const session = req.session
        const employee = await employeeModel.findOne({ userId: session.userId })
        if (!employee) {
            return res.json({
                firstName: "Admin",
                lastName: "",
                email: session.email
            })
        }
        return res.json(employee)
    }
    catch(error){
        return res.status(500).json({error:"Failed to fetch profile"})
    }
}

export const updateProfile = async (req, res) => {
    try{
        const session=req.session
        const employee=await employeeModel.findOne({userId:session.userId})
        if(!employee) return res.status(404).json({error:"Employee Not Found"})
        if(employee.isDeleted){
            return res.status(403).json({error:"Your Account is deactivated.You Cannot update your profile"})
        }
        await employeeModel.findByIdAndUpdate(employee._id,{
            bio:req.body.bio
        })
        return res.json({success:true})
    }
    catch(error){
        return res.status(500).json({error:"Failed to udate Profile"})
    }
}