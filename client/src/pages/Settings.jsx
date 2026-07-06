import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import {useAuth} from '../context/AuthContext'
import { Lock } from 'lucide-react'
import ProfileForm from '../components/ProfileForm'
import ChangePasswordModal from '../components/ChangePasswordModal'
import api from '../api/axios'
import toast from 'react-hot-toast'

const Settings = () => {
  const {user}=useAuth();
  const [profile,setprofile]=useState(null)
  const [loading,setloading]=useState(true)
  const [showPasswordModal,setshowPasswordModal]=useState(false)
  const fetchProfile=async()=>{
    try{
      const res=await api.get('/profile')
      setprofile(res.data)
    }catch(e){
      toast.error(e.response?.data?.error||e.message)
    }finally{
      setloading(false)
    }
  }
  useEffect(()=>{
    fetchProfile()
  },[])
  if(loading) return <Loading/>
  return (
    <div className='animate-fade-in'>
      <div className='page-header'>
        <h1 className='page-title'>Settings</h1>
        <p className='page-subtitle'>Manage Your Account and Preferences</p>
      </div>
      {profile && <ProfileForm initialData={profile} onSuccess={fetchProfile}/>}
      <div className='card max-w-md p-6 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='p-2.5 bg-slate-100 rounded-lg'>
            <Lock className='w-5 h-5 bg-slate-100 rounded-lg'/>
          </div>
          <div>
            <p className='font-medium text-slate-900'>Password</p>
            <p className='text-sm text-slate-500'>Update your account password</p>
          </div>
        </div>
        <button className='btn-secondary text-sm' onClick={()=>setshowPasswordModal(true)}>Change</button>
      </div>
      <ChangePasswordModal open={showPasswordModal} onClose={()=>setshowPasswordModal(false)}/>
    </div>
  )
}

export default Settings