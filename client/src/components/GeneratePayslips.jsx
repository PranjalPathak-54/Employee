import { Loader2, Loader2Icon, Plus, X } from 'lucide-react'
import React, { useState } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const GeneratePayslips = ({ employees, onSuccess }) => {
    const [isOpen, setisOpen] = useState(false)
    const [loading, setloading] = useState(false)
    if (!isOpen) return (
        <button onClick={() => setisOpen(true)} className='btn-primary flex items-center gap-2'>
            <Plus className='w-4 h-4' /> Generate Payslip
        </button>
    )
    const handleSubmit = async (e) => {
        e.preventDefault()
        setloading(true)
        try{
            const formData=new FormData(e.currentTarget)
            await api.post('/payslips',Object.fromEntries(formData))
            toast.success('Payslip generated successfully')
            onSuccess()
            setisOpen(false)
        }catch(err){
            toast.error(err.response?.data?.error||err.message)
        }finally{
            setloading(false)
        }
    }
    return (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <div className='card max-w-lg w-full p-6 animate-slide-up'>
                <div className='flex justify-between items-center mb-6'>
                    <h3 className='text-lg font-bold text-slate-900'>Generate Monthly Payslip</h3>
                    <button onClick={() => setisOpen(false)} className='text-slate-400 hover:text-slate-600 p-1'>
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <label className='block text-sm font-medium text-slate-700 mb-2'>Employee</label>
                        <select name='employeeId' required>
                            {employees.map((e) => (
                                <option key={e.id} value={e.id}>
                                    {e.firstName} {e.lastName} ({e.position})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <label className='block text-sm font-medium text-slate-700 mb-2'>Month</label>
                        <select name='month'>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-slate-700 mb-2'>Year</label>
                        <input type="number" name="year" defaultValue={new Date().getFullYear()} />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-slate-700 mb-2'>Basic Salary</label>
                        <input type="number" name="basicSalary" required placeholder="5000" />
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-medium text-slate-700 mb-2'>Allowances</label>
                            <input type="number" name="allowances" defaultValue="0" />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-slate-700 mb-2'>Deductions</label>
                            <input type="number" name="deductions" defaultValue="0" />
                        </div>
                    </div>
                    <div className='flex justify-end gap-3 pt-2'>
                        <button onClick={()=>setisOpen(false)} type="button" className='btn-secondary'>Cancel</button>
                        <button disabled={loading} type="submit" className='btn-primary flex items-center'>
                            {loading && <Loader2/>}
                            Generate
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default GeneratePayslips