import React from 'react'
import './notfound.css'
function Notfound() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-black'>
      <div className='flex flex-col items-center'>
        {/* <img className='w-96' src="https://i.kym-cdn.com/entries/icons/original/000/000/226/gendoposecover.jpg" alt="" /> */}
        <h1 className='text-5xl font-bold text-purple-600'> <span className='text-red-500'>#</span> {`Notfound 404 ERROR -->`}</h1>
        <button className='bg-red-500 p-3 rounded-lg mt-3'>
            <a className='text-2xl font-bold text-white' href="/">Goto Home page</a>
        </button>
      </div>
    </div>
  )
}

export default Notfound