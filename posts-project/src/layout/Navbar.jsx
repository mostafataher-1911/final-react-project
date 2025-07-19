import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../Firebase/config'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  const handleLogOut = async () => {
    try {
      await signOut(auth)
      setUser(null)
      navigate('/login')
    } catch (error) {
      console.error('Error loging out:', error)
    }
  }

  return (
    <div className="navbar bg-black text-white shadow-md px-4">
      <div className="flex-1">
        <Link to="/" className="text-2xl font-bold text-white">
          posts.co
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 text-white font-medium">
          <li>
            <Link to="/" className="hover:text-gray-300">Home</Link>
          </li>
          {user ? (
            <>
              <li>
                <button onClick={handleLogOut} className="hover:text-gray-300">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="hover:text-gray-300">Login</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-gray-300">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  )
}
