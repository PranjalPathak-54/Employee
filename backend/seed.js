import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from './config/db.js'
import userModel from './models/User.js';
import bcrypt from 'bcrypt'
const TemporaryPassword="admin123"

async function registerAdmin(){
    try{
        const ADMIN_EMAIL=process.env.ADMIN_EMAIL;
        if(!ADMIN_EMAIL){
            console.error('Missing ADMIN EMAIL')
            process.exit(1)
        }
        await connectDB()
        const existingAdmin=await userModel.findOne({email:process.env.ADMIN_EMAIL})
        if(existingAdmin){
            existingAdmin.role='ADMIN'
            existingAdmin.password=await bcrypt.hash(TemporaryPassword,10)
            await existingAdmin.save()
            console.log("User role updated to ADMIN")
            process.exit(0)
        }
        const hashedPassword=await bcrypt.hash(TemporaryPassword,10)
        const admin=await userModel.create({
            email:process.env.ADMIN_EMAIL,
            password:hashedPassword,
            role:'ADMIN'
        })
        console.log("Admin user created")
        console.log("\nemail:",admin.email)
        console.log("\npassword",admin.password)
        console.log("\nchange the password after login")

        process.exit(0)
    }
    catch(error){
        console.error("Seed Failed",error)
    }
}

registerAdmin()