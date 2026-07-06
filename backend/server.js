import express from 'express'
import cors from 'cors'
import multer from 'multer'
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './config/db.js'
import authRouter from './router/authRouter.js'
import employee from './router/employeeRouter.js'
import profileRouter from './router/profileRouter.js'
import attendanceRouter from './router/attendanceRouter.js'
import leaveRouter from './router/leaveRoute.js'
import payslipRouter from './router/payslipRouter.js'
import dashboardRouter from './router/dashboardRouter.js'
import { inngest, functions } from './inngest/index.js'
import { serve } from 'inngest/express'
const app=express()
app.use(express.json())
app.use(cors())
app.use(multer().any())
await connectDB();
app.get('/',(req,res)=>{
    res.send('Server is Live')
})
app.use('/api/auth',authRouter)
app.use('/api/employee',employee)
app.use('/api/profile',profileRouter)
app.use('/api/attendance',attendanceRouter)
app.use('/api/leave',leaveRouter)
app.use('/api/payslips',payslipRouter)
app.use('/api/dashboard',dashboardRouter)
app.use('/api/inngest',serve({client:inngest,functions}))
app.listen(4000,()=>{
    console.log('Server running')
})