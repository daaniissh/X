import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUpPage from './pages/auth/signup/Signup'
import LoginPage from './pages/auth/login/Login'
import HomePage from './pages/home/HomePage'
import Sidebar from './components/common/Sidebar'
import RightPanel from './components/common/RightPanel'
import NotificationPage from './pages/Notification/NotificationPage'
import ProfilePage from './pages/Profile/ProfilePage'
import { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from './components/common/LoadingSpinner'

function App() {


  const { data: authUser, isLoading, error, isError } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("https://x-nu-murex.vercel.app/api/auth/me", {
          method:"GET",
          credentials: "include", 
         
        });
        const data = await res.json()
        if (data.error) return null
        if (!res.ok || data.error) {
          throw new Error(data.error || "Something went wrong")
        }
        console.log(data, "===user data")
        return data
      } catch (error) {
        throw new Error(error)
      }
    },
    retry: false,
  })
  if (isLoading) {
    return (
      <div className='h-screen flex justify-center items-center' >
        <LoadingSpinner size="lg" />

      </div>
    )
  }

  return (
    <div className='flex max-w-6xl mx-auto'>
      {authUser && <Sidebar />}
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to="/login" />} />
        <Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
      {authUser && <RightPanel />}
      <Toaster />
    </div>
  )
}

export default App
