import { Loader2Icon, LogInIcon, LogOutIcon } from 'lucide-react'
import React,{useState} from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const CheckInbutton = ({todayRecord,onAction}) => {
  const [loading,setloading]=useState(false)
  const handleAttendance=async()=>{
    setloading(true)
    try{
      await api.post('/attendance')
      onAction()
    }catch(e){
      toast.error(e.response?.data?.error||e.message)
    }finally{
      setloading(false)
    }
  }
  if(todayRecord?.checkOut){
    return(
        <div className='flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200'>
            <h3 className='text-lg font-bold text-slate-900'>Work Day Completed</h3>
            <p className='text-slate-500 text-sm mt-1'>Great Job See You Tomorrow</p>
        </div>
    )
  }
  const isCheckedin=!!todayRecord?.checkIn && !todayRecord?.checkOut
  return (
    <div className='absolute bottom-4 right-4 flex flex-col z-1'>
        <button onClick={handleAttendance} className={`w-full max-w-xs flex justify-between items-center gap-8 p-4 rounded-xl bg-linear-to-br text-white ${isCheckedin ? "from-slate-700 to-slate-900":"from-indigo-600 to-indigo-700"}`}>
            {loading ? <Loader2Icon className='size-7 animate-spin'/>:isCheckedin ? <LogOutIcon className='size-7'/>:<LogInIcon className='size-7'/>}
            <div>
                <h2>{loading ? "Processing...":isCheckedin ? "Clocked Out":"Clocked In"}</h2>
                <p>{isCheckedin ? "Click to end the shift":"start your work day"}</p>
            </div>
        </button>
    </div>
  )
}

export default CheckInbutton