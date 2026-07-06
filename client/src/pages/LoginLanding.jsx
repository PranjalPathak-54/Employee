import React from 'react'
import LoginLeftSide from '../components/LoginLeftSide'
import { Link, Navigate } from 'react-router-dom'
import { ArrowRightIcon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Loading from '../components/Loading'

const LoginLanding = () => {
    const {user,loading}=useAuth()
    if(loading) return <Loading/>
    if(user) return <Navigate to='/dashboard'/>
    const loginOptions = [
        {
            to: "/login/admin",
            title: "Admin Portal",
            description: "Manage employees,departments,payroll and system configuration",
        },
        {
            to: "/login/employee",
            title: "Employee Portal",
            description: "View your profile,track attendance,request time off and access payslips",
        }
    ]
    return (
        <div className='min-h-screen flex flex-col md:flex-row'>
            <LoginLeftSide />
            <div className='w-full md:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 relative overflow-y-auto min-h-screen'>
                <div className='w-full max-w-md animate-fade-in-relative z-10'>
                    <div className='mb-10 text-center md:text-left'>
                        <h2 className='text-3xl font-medium text-slate-900 tracking-tight mb-3'>Welcome Back</h2>
                        <p className='text-slate-500'>Select your portal to securely access the system.</p>
                    </div>
                    <div className='space-y-4'>
                        {loginOptions.map((portal) => (
                            <Link key={portal.to} to={portal.to} className='group block bg-slate-50 border border-slate200 rounded-lg p-5 sm:p-6 transition-all duration-300 hover:border-indigo-400 hover:bg-indigo-50'>
                                <div className='relative z-10 flex items-center justify-between gap-4 sm:gap-5'>
                                    <h1 className='text-lg text-slate-800 group-hover:text-indigo-600 mb-1 transition-colors'>{portal.title}</h1>
                                    <ArrowRightIcon className='w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-300' />
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div>
                        <p className='mt-12 text-center md:text-left text-sm text-slate-400'>© {new Date().getFullYear()} Coderso . All Rights are reserved</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginLanding