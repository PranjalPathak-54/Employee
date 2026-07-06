import 'dotenv/config'
import connectDB from './config/db.js'
import userModel from './models/User.js'

async function fix() {
    await connectDB()

    // Drop stale userId index from User collection
    try {
        await userModel.collection.dropIndex('userId_1')
        console.log('Dropped stale userId_1 index from User collection')
    } catch (e) {
        console.log('userId_1 index not found or already dropped:', e.message)
    }

    // Clean up admin document - remove old schema fields
    const result = await userModel.collection.updateOne(
        { email: process.env.ADMIN_EMAIL },
        { $unset: { userId: '', firstName: '', lastName: '', phone: '', basicSalary: '', allowances: '', deductions: '', employeeStatus: '', joinDate: '', isDeleted: '', bio: '' } }
    )
    console.log('Admin document cleaned up:', result.modifiedCount, 'document(s) updated')

    console.log('\nDone. You can now create employees.')
    process.exit(0)
}

fix().catch((e) => { console.error(e); process.exit(1) })
