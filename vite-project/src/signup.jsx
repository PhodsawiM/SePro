import React from 'react'
import {useState,useEffect} from 'react';
import './signup.css'
import FileUpload from './component/fileUp.jsx'
function Signup() {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleButtonClick = () => {
    if(isAnimating == false){
      setIsAnimating(true)
      console.log(isAnimating)
      
    }else ()=>{
      setIsAnimating(false)
      console.log(isAnimating)
    }


    // Optionally reset animation after it completes
    // setTimeout(() => setIsAnimating(false), 1000); // 1000ms is the duration of the animation
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Animate</button>
      <div className={`box ${isAnimating ? 'animate' : 'hidden'}`}>
        I'm animated!
        <FileUpload>

        </FileUpload>
      </div>
    </div>
  );
}

export default Signup