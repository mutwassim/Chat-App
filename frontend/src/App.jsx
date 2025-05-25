import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/useAuthStore'
import { useEffect } from 'react'

function App() {
  const {authUser,checkAuth,isCheckingAuth} = useAuthStore()
  useEffect(()=>{
    checkAuth();
  },[checkAuth]
)
console.log({authUser})

if(isCheckingAuth && !authUser){
  return(
    <div className='flex items-center justify-center h-screen'>
          <span className="loading loading-spinner loading-xl"></span>
    </div>
  )
}
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <Home />: <Navigate to="/login"/>} />
        <Route path="/login" element={!authUser ? <Login />: <Navigate to="/"/>} />
        <Route path="/signup" element={!authUser ? <Signup />: <Navigate to="/"/>} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={authUser?<Profile />:<Navigate to="/login"/>} />
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
