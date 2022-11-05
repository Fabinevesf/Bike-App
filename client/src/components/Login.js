import React, { useState } from 'react'
import axios from 'axios'
import './Login.css'

function Login() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  })

  const { username, password } = credentials

  const handleChange = (e) => {
    const { name, value } = e.target

    setCredentials({ ...credentials, [name]: value })
  }

  const login = async () => {
    try {
      const { data } = await axios('/users/login', {
        method: 'POST',
        data: credentials,
      })

      //store it locally
      localStorage.setItem('token', data.token)
      console.log(data.message, data.token)
    } catch (error) {
      console.log(error)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
  }

  const requestData = async () => {
    try {
      const { data } = await axios('/users/profile', {
        headers: {
          authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })

      console.log(data.message)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <div className='login'>
        <h2>Login Bike Users</h2>
        <input
          value={username}
          onChange={handleChange}
          name='username'
          type='text'
          className='form-control mb-3'
          placeholder='Enter with your username'
        />{' '}
        Username
        <input
          value={password}
          onChange={handleChange}
          name='password'
          type='password'
          className='form-control mb-3'
          placeholder='Password'
        />{' '}
        Password
        <br />
        <br />
        <br />
        <button className='btn btn-success' onClick={login}>
          Log in
        </button>
        <button className='btn btn-outline-success btn-sm' onClick={logout}>
          Log out
        </button>
      </div>
      <div className='text-center p-4'>
        <button className=' btn btn-outline-primary' onClick={requestData}>
          Request protected data
        </button>
      </div>
    </div>
  )
}

export default Login
