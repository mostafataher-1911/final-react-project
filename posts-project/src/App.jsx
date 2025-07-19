import './App.css'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast';
import Register from './pages/Register'
import Login from './pages/Login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AddPost from './pages/Addposts';
import EditPost from './pages/Editeposts';
import Navbar from './layout/Navbar';


function App() {


  return (
    <>
  
   <Toaster position="top-right" />
  
    <BrowserRouter>
    <Navbar></Navbar>
    <Routes>
    <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route  path="/editpost/:id" element={<EditPost />} />
         <Route path="/addpost" element={<AddPost/>} />


    </Routes>
    </BrowserRouter>

    </>
  )
}

export default App
