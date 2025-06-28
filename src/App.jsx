import { useState } from 'react'
import './App.css'
// import { useDispatch } from 'react-redux'
// import authService from './appwrite/auth'
import { useEffect } from 'react'
// import {login,logout} from "./store/authSlice"
// import { Outlet } from 'react-router-dom'


function App() {
  //conditional rendering
  return (
    <>
      <Register/>
    </>
  )

}
// import { formatProdErrorMessage } from '@reduxjs/toolkit'
import Register from './Pages/Register'

export default App
