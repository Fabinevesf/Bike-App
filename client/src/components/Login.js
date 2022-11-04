import React, { useState } from 'react'
import axios from 'axios'

function Login() {
  const [credentials, setCredentials] = useState({
    username: 'test',
    password: 'test',
  })

  const { username, password } = credentials

  const handleChange = (e) => {
    const { name, value } = e.target
    console.log('hello :)')
    setCredentials({ ...credentials, [name]: value })
    console.log(credentials)
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
      <div>
        <input
          value={username}
          onChange={handleChange}
          name='username'
          type='text'
          className='form-control mb-2'
        />
        <input
          value={password}
          onChange={handleChange}
          name='password'
          type='password'
          className='form-control mb-2'
        />
        <button className='btn btn-primary' onClick={login}>
          Log in
        </button>
        <button className='btn btn-outline-dark ml-2' onClick={logout}>
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
