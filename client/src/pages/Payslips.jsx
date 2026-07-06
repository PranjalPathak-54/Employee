import React, { useCallback, useState,useEffect} from 'react'
import Loading from '../components/Loading'
import PayslipList from '../components/PayslipList'
import GeneratePayslips from '../components/GeneratePayslips'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const Payslips = () => {
  const [payslips,setpayslips]=useState([])
  const [employees,setemployees]=useState([])
  const [loading,setloading]=useState(true)
  const {user}=useAuth()
  const isAdmin=user?.role==='ADMIN'
  const fetchPayslips=useCallback(async()=>{
    try{
      const res=await api.get('/payslips')
      setpayslips(res.data.data||[])
    }catch(e){
      toast.error(e.response?.data?.error||e.message)
    }finally{
      setloading(false)
    }
  },[])
  useEffect(()=>{
    fetchPayslips()
  },[fetchPayslips])
  useEffect(()=>{
    if(isAdmin){
      api.get('/employee').then(res=>setemployees(res.data.filter((e)=>!e.isDeleted))).catch(()=>{})
    }
  },[isAdmin])
  if(loading) return <Loading/>
  return (
    <div className='animate-fade-in'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
        <div>
          <h1 className='page-title'>Payslips</h1>
          <p className='page-subtitle'>{isAdmin ? "Generate and Manage employee payslips":"Your Payslip history"}</p>
        </div>
        {isAdmin && <GeneratePayslips employees={employees} onSuccess={fetchPayslips}/>}
      </div>
      <PayslipList payslips={payslips} isAdmin={isAdmin}/>
    </div>
  )
}

export default Payslips