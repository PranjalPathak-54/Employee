import React,{useEffect, useState} from 'react'
import { dummyAdminDashboardData, dummyEmployeeDashboardData } from '../assets/assets'
import Loading from '../components/Loading'
import EmployeeDashboard from './EmployeeDashboard'
import AdminDashboard from '../components/AdminDashboard'
import toast from 'react-hot-toast'
import api from '../api/axios'

const Dashboard = () => {
  const [data,setdata]=useState(null)
  const [loading,setloading]=useState(true)
  useEffect(()=>{
    api.get('/dashboard').then((res)=>setdata(res.data)).catch((err)=>toast.error(err.response?.data?.error||err?.message)).finally(()=>setloading(false))
  },[])
  if(loading) return <Loading/>
  if(!data) return <p className='text-center text-slate-500 py-12'>Failed To Load Dashboard</p>
  if(data.role==='ADMIN'){
    return <AdminDashboard data={data}/>
  }
  else{
    return <EmployeeDashboard data={data}/>
  }
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard