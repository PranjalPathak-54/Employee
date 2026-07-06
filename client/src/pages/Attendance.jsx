import React,{useCallback, useState,useEffect} from 'react'
import Loading from '../components/Loading'
import CheckInbutton from '../components/CheckInbutton'
import AttendanceStats from '../components/AttendanceStats'
import AttendanceHistory from '../components/AttendanceHistory'
import api from '../api/axios'
import toast from 'react-hot-toast'
const Attendance = () => {
  const [history,sethistory]=useState([])
  const [loading,setloading]=useState(true)
  const [isDeleted,setisDeleted]=useState(false)
  const fetchData=useCallback(async()=>{
    try{
      const res=await api.get('/attendance')
      const json=res.data
      sethistory(json.data||[])
      if(json.employee?.isDeleted) setisDeleted(true)
    }catch(e){
      toast.error(e.response?.data?.error||e.message)
    }finally{
      setloading(false)
    }
  },[])
  useEffect(()=>{
    fetchData()
  },[fetchData])
  if(loading) return <Loading/>
  const today=new Date()
  today.setHours(0,0,0,0)
  const todayRecord=history.find((r)=>new Date(r.date).toDateString()===today.toDateString())
  return (
    <div className='animate-fade-in'>
      <div className='page-header'>
        <h1 className='page-title'>Attendance</h1>
        <p className='page-subtitle'>Track your daily work hours</p>
      </div>
      {
        isDeleted ? (
          <div className='mb-8 p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center'>
            <p className='text-rose-600'>You can no longer mark in and out of employee records</p>
          </div>
        ):(
          <div className='mb-8'>
            <CheckInbutton todayRecord={todayRecord} onAction={fetchData}/>
          </div>
        )
      }
      <AttendanceStats history={history}/>
      <AttendanceHistory history={history}/>
    </div>
  )
}

export default Attendance