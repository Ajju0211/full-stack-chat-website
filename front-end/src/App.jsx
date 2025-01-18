import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import SettingPage from './pages/SettingPage'
import SignUpPage from './pages/SignUpPage'
import Navbar from './components/Navbar.jsx'
import { Loader } from 'lucide-react'
import { useAuthStore } from './store/useAuthStore.js'
import { useEffect } from 'react'
import { Toaster } from "react-hot-toast"


const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  },[checkAuth])

  if(isCheckingAuth && authUser ) {
    return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className='animate-spin' />
    </div>)
  }

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />}/>
        <Route path="/login" element={!authUser ? <LoginPage /> :<Navigate to="/" />}/>
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />}/>
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />}/>
        <Route path="/settings" element={<SettingPage />}/>
      </Routes>
      <Toaster />
    </div>

  )
}

export default App
