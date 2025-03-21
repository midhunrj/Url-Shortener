// import './App.css'
import { Toaster } from 'sonner'
import { Route, Routes } from 'react-router-dom'
import Login from './components/login'
import Home from './components/home'
import Register from './components/register'
import History from './components/historyUrls'
import UserProtected from './protected/userProtected'

function App() {


  return (
    <>
      <Toaster/>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/home' element={<UserProtected><Home/></UserProtected>}></Route>
        <Route path='/history' element={<UserProtected><History/></UserProtected>}></Route>
      </Routes>
    </>
  )
}

export default App
