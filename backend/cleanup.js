import 'dotenv/config'
import connectDB from './config/db.js'
import userModel from './models/User.js'
import employeeModel from './models/Employee.js'

async function cleanup() {
    await connectDB()
    const users = await userModel.find({})
    let deleted = 0
    for (const user of users) {
        const isAdmin = user.role === 'ADMIN'
        if (isAdmin) continue
        const employee = await employeeModel.findOne({ userId: user._id })
        if (!employee) {
            await userModel.findByIdAndDelete(user._id)
            console.log(`Deleted orphaned user: ${user.email}`)
            deleted++
        }
    }
    console.log(`\nCleanup complete. Deleted ${deleted} orphaned user(s).`)
    process.exit(0)
}

cleanup().catch((e) => { console.error(e); process.exit(1) })
