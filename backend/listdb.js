import 'dotenv/config'
import connectDB from './config/db.js'
import userModel from './models/User.js'
import employeeModel from './models/Employee.js'

async function listAll() {
    await connectDB()
    const users = await userModel.find({}).lean()
    const employees = await employeeModel.find({}).lean()
    console.log('\n=== USERS ===')
    users.forEach(u => console.log(`id:${u._id} | email:${u.email} | role:${u.role}`))
    console.log('\n=== EMPLOYEES ===')
    employees.forEach(e => console.log(`id:${e._id} | email:${e.email} | userId:${e.userId}`))
    process.exit(0)
}

listAll().catch((e) => { console.error(e); process.exit(1) })
