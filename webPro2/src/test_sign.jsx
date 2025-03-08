import React from 'react'
// import './index.css'
import { FormControl,InputLabel,Input,FormHelperText,TextField } from '@mui/material';
function Test_sign() {
  return (
    <div className='bg-white min-h-screen'>
        <div className='flex bg-gray-400 min-h-screen justify-center'>
          <div className='my-auto'>
            <FormControl className='bg-white rounded-lg px-3 mt-2 my-auto' >
                <h1 className='text-4xl my-2'>
                  Login
                </h1>
                <TextField
                className='m-2'
                id="outlined-password-input"
                label="username"
                type="text"
                autoComplete="current-password"
                />
                <TextField
                className='m-2'
                id="outlined-password-input"
                label="Password"
                type="password"
                autoComplete="current-password"
                />
                <FormHelperText className='text-end' id="my-helper-text"><span>if you don't have an account </span><a className='text-blue-300' href="">Signup</a></FormHelperText>
                <button className='bg-blue-400 rounded-lg h-8 w-6/12 mx-auto my-3'>
                  <p className='text-white font-bold'>Submit</p>
                </button>
            </FormControl>
          </div>
        </div>
    </div>
  )
}
