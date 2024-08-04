import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import SignUpPage from './pages/auth/signup/Signup'
import LoginPage from './pages/auth/login/Login'
import HomePage from './pages/home/HomePage'
import Sidebar from './components/common/Sidebar'
import RightPanel from './components/common/RightPanel'
import NotificationPage from './pages/Notification/NotificationPage'
import ProfilePage from './pages/Profile/ProfilePage'

function App() {


  return (
    <div className='flex max-w-6xl mx-auto'>
      <Sidebar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/notifcation' element={<NotificationPage />} />
        <Route path='/profile/:username' element={<ProfilePage />} />
      </Routes>
      <RightPanel/>
    </div>
  )
}

export default App
