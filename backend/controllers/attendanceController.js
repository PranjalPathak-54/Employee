import { inngest } from "../inngest/index.js"
import attendance from "../models/Attendance.js"
import employeeModel from "../models/Employee.js"

export const clockInout=async(req,res)=>{
    try{
        const session=req.session
        const employee=await employeeModel.findOne({userId:session.userId})
        if(!employee) return res.status(404).json({error:"Employee Not Found"})
        if(employee.isDeleted) return res.status(403).json({error:"Your account is deactivated.You cannot clock in or out"})
        const today=new Date();
        today.setHours(0,0,0,0)
        const existing=await attendance.findOne({
            employeeId:employee._id,
            date:today,
        })
        const now=new Date()
        if(!existing){
            const isLate=now.getHours()>=9 && now.getMinutes()>0;
            const attendances=await attendance.create({
                employeeId:employee._id,
                date:today,
                checkIn:now,
                status:isLate ? "LATE":"PRESENT"
            })
            inngest.send({
                name:"employee/check-out",
                data:{
                    employeeId:employee._id,
                    attendanceId:attendances._id,
                }
            }).catch((e)=>console.error("Inngest send failed:",e.message))
            return res.json({success:true,type:"CHECK_IN",date:attendances})
        }
        else if(!existing.checkOut){
            const checkInTime=new Date(existing.checkIn).getTime()
            const diffMs=now.getTime()-checkInTime
            const diffHours=diffMs/(1000*60*60)
            existing.checkOut=now
            const workingHours=parseFloat(diffHours.toFixed(2))
            let dayType="Half Day"
            if(workingHours>=8) dayType="Full Day"
            else if(workingHours>=6) dayType="Three Quarter Day"
            else if(workingHours>=4) dayType="Half Day"
            else dayType="Short Day"
            existing.workingHours=workingHours
            existing.dayType=dayType
            await existing.save()
            return res.json({success:true,type:"CHECK_OUT",date:existing})
        }
        else{
            return res.json({success:true,type:"CHECK_OUT",date:existing})
        }
    }
    catch(error){
        console.error("Attendance Error",error)
        return res.status(500).json({error:"Operation Failed"})
    }
}

export const getAttendance=async(req,res)=>{
    try{
        const session=req.session
        const employee=await employeeModel.findOne({userId:session.userId})
        if(!employee) return res.status(404).json({error:"Employee Not Found"})
        const limit=parseInt(req.query.limit||30)
        const history=await attendance.find({employeeId:employee._id}).sort({date:-1}).limit(limit)
        return res.json({data:history,employee:{isDeleted:employee.isDeleted}})
    }
    catch(error){
        return res.status(500).json({error:"Failed To fetch attendance"})
    }
}