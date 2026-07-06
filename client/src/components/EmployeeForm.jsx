import React,{useState,useEffect}from 'react'
import { useNavigate } from 'react-router-dom'
import { DEPARTMENTS } from '../assets/assets'
import { Loader2Icon } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
const EmployeeForm = ({initialData,onSuccess,onCancel}) => {
  const navigate=useNavigate()
  const [loading,setloading]=useState(false)
  const isEditmode=!!initialData
  const handleSubmit=async(e)=>{
    e.preventDefault()
    setloading(true)
    const formData=new FormData(e.currentTarget)
    if(!isEditmode){
        const pwd=formData.get("password")
        if(!pwd) formData.delete("password")
    }
    try{
        const url=isEditmode ? `/employee/${initialData.id}`:`/employee`
        const method=isEditmode ? "put":"post"
        await api[method](url,formData)
        onSuccess ? onSuccess():navigate("/employees")
    }
    catch(error){
        toast.error(error.response?.data?.error||error.message)
    }
    finally{
        setloading(false)
    }
  }
  return (
    <form onSubmit={handleSubmit} className='space-y-6 max-w-3xl animate-fade-in'>
        <div className='card p-5 sm:p-6'>
            <h3 className='font-medium mb-6 pb-4 border-b border-slate-100'>{isEditmode ? 'Edit Employee' : 'Add New Employee'}</h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700'>
                <div>
                    <label className='block mb-2'>First Name</label>
                    <input name='firstName' required defaultValue={initialData?.firstName}/>
                </div>
                <div>
                    <label className='block mb-2'>Last Name</label>
                    <input name='lastName' required defaultValue={initialData?.lastName}/>
                </div>
                <div>
                    <label className='block mb-2'>Phone Number</label>
                    <input name='phone' required defaultValue={initialData?.phone}/>
                </div>
                <div>
                    <label className='block mb-2'>Join Date</label>
                    <input type='date' name='joinDate' required defaultValue={initialData?.joinDate ? new Date(initialData.joinDate).toISOString().split("T")[0]:""}/>
                </div>
                <div className='sm:col-span-2'>
                    <label className='block mb-2'>Bio(Optional)</label>
                    <textarea name='bio' defaultValue={initialData?.bio} rows={3} className='resize-none' placeeholder='Brief Description...'/>
                </div>
            </div>
        </div>
        <div className='card p-5 sm:p-6'>
            <h3 className='text-base font-medium text-slate-900 mb-6 p-4 border-b border-slate-100'>Employee Details</h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700'>
                <div>
                    <label className='block mb-2'>Department</label>
                    <select name="department" defaultValue={initialData?.department||""}>
                        <option value="">Select Department</option>
                        {
                            DEPARTMENTS.map((deptName)=>(
                                <option key={deptName} value={deptName}>
                                    {deptName}
                                </option>
                            ))
                        }
                    </select>
                </div>
                <div>
                    <label className='block mb-2'>Position</label>
                    <input name='position' required defaultValue={initialData?.position}/>
                </div>
                <div>
                    <label className='block mb-2'>Basic Salary</label>
                    <input type="number" name='basicSalary' required min="0" step="0.01" defaultValue={initialData?.basicSalary||0}/>
                </div>
                <div>
                    <label className='block mb-2'>Allowances</label>
                    <input type="number" name='allowances' required min="0" step="0.01" defaultValue={initialData?.allowances||0}/>
                </div>
                <div>
                    <label className='block mb-2'>Deductions</label>
                    <input type="number" name='deductions' required min="0" step="0.01" defaultValue={initialData?.deductions||0}/>
                </div>
                {
                    isEditmode && (
                        <div>
                            <label className='block mb-2'>Status</label>
                            <select name='employmentStatus' defaultValue={initialData?.employmentStatus}>
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                            </select>
                        </div>
                    )
                }
            </div>
        </div>
        <div className='card p-5 sm:p-6'>
            <h3 className='font-medium text-slate-900 mb-6 pb-4 border-b border-slate-100'>Account Setup</h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700'>
                <div className='sm:col-span-2'>
                    <label className='block mb-2'>Work email</label>
                    <input type="email" name='email' required autoComplete="off" defaultValue={initialData?.email}/>
                </div>
                {
                    !isEditmode && (
                        <div>
                            <label className='block mb-2'>Temporary Password</label>
                            <input type='password' name='password' required autoComplete="new-password"/>
                        </div>
                    )
                }
                {
                    isEditmode && (
                        <div>
                            <label className='block mb-2'>Change Password(Optional)</label>
                            <input type='password' name='password' placeholder='Leave Blank to keep current'/>
                        </div>
                    )
                }
                <div>
                    <label className='block mb-2'>System Role</label>
                    <select name='role' defaultValue={initialData?.user?.role||'EMPLOYEE'}>
                        <option value='EMPLOYEE'>Employee</option>
                        <option value='ADMIN'>Admin</option>
                    </select>
                </div>
            </div>
        </div>
        <div className='flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2'>
            <button type="button" className='btn-secondary' onClick={()=>(onCancel?onCancel():navigate(-1))}>Cancel</button>
            <button type="submit" disabled={loading} className='btn-primary flex items-center justify-center'>
                {loading && <Loader2Icon className='w-4 h-4 mr-2 animate-spin'/>}
                {isEditmode ? "Update Employee":"Create Employee"}
            </button>
        </div>
    </form>
  )
}

export default EmployeeForm