import { format } from 'date-fns'
import { Check, Loader2, X } from 'lucide-react'
import React, { useState } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const Leavehistory = ({leaves,isAdmin,onUpdate}) => {
  const [processing,setprocessing]=useState(null)
  const handleStatusUpdate=async(id,status)=>{
    setprocessing(id)
    try{
      await api.patch(`/leave/${id}`,{status})
      onUpdate()
    }catch(err){
      toast.error(err.response?.data?.error||err.message)
    }finally{
      setprocessing(null)
    }
  }
  return (
    <div className='card overflow-hidden'>
            <div className='overflow-x-auto'>
                <table className='table-modern'>
                    <thead>
                        <tr>
                            {isAdmin && <th>Employee</th>}
                            <th>Type</th>
                            <th>Dates</th>
                            <th>Reason</th>
                            <th>Status</th>
                            {isAdmin && <th className='text-center'>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {leaves.length===0 ? (
                            <tr>
                                <td colspan={isAdmin ? 6:4} className='text-center py-12 text-slate-400'>No Leave Applications Found</td>
                            </tr>
                        ):(leaves.map((leaves)=>{
                            return(
                                <tr key={leaves._id||leaves.id}>
                                    {
                                        isAdmin && (
                                            <td className='text-slate-900'>
                                                {leaves.employee?.firstName}
                                                {leaves.employee?.lastName}
                                            </td>
                                        )
                                    }
                                    <td>
                                        <span className='badge bg-slate-100 text-slate-600'>{leaves.type}</span>
                                    </td>
                                    <td className='text-xs text-slate-500'>
                                        {format(new Date(leaves.startDate),"MMM dd")}-{format(new Date(leaves.endDate),"MMM dd , yyyy")}
                                    </td>
                                    <td className='max-w-xs truncate text-slate-500' title={leaves.reason}>{leaves.reason}</td>
                                    <td className={`badge ${leaves.status==='APPROVED' ? 'badge-success':leaves.status==='REJECTED'?"badge-danger":"badge-warning"}`}>{leaves.status}</td>
                                    {
                                        isAdmin && (
                                            <td>
                                                {leaves.status==='PENDING' && (
                                                    <div className='flex justify-center gap-2'>
                                                        <button disabled={!!processing} onClick={()=>handleStatusUpdate(leaves._id||leaves.id,"APPROVED")} className='p-1.5 rounded-md bg-green-50 text-green-600 hover:bg-green-100 transition-colors'>
                                                            {processing===(leaves._id||leaves.id) ? <Loader2 className='w-4 h-4 animate-spin'/>:<Check/>}
                                                        </button>
                                                        <button onClick={()=>handleStatusUpdate(leaves._id||leaves.id,"REJECTED")} className='p-1.5 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors'>
                                                            {processing===(leaves._id||leaves.id) ? <Loader2 className='w-4 h-4 animate-spin'/>:<X className='w-4 h-4'/>}
                                                        </button> 
                                                    </div>
                                                )}
                                            </td>
                                        )
                                    }
                                </tr>
                            )
                        }))}
                    </tbody>
                </table>
            </div>
        </div>
  )
}

export default Leavehistory