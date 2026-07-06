import 'dotenv/config'
import connectDB from './config/db.js'
import userModel from './models/User.js'
import employeeModel from './models/Employee.js'

async function diagnose() {
    await connectDB()

    console.log('\n=== USER INDEXES ===')
    const userIndexes = await userModel.collection.indexes()
    console.log(JSON.stringify(userIndexes, null, 2))

    console.log('\n=== EMPLOYEE INDEXES ===')
    const empIndexes = await employeeModel.collection.indexes()
    console.log(JSON.stringify(empIndexes, null, 2))

    console.log('\n=== ALL USERS ===')
    const users = await userModel.find({}).lean()
    console.log(JSON.stringify(users, null, 2))

    console.log('\n=== ALL EMPLOYEES ===')
    const employees = await employeeModel.find({}).lean()
    console.log(JSON.stringify(employees, null, 2))

    process.exit(0)
}

diagnose().catch((e) => { console.error(e); process.exit(1) })
