import React, { useState } from 'react'
import './login.css'
import'./register.css'
import Leftfa from './assets/left.svg'
import Rightfa from './assets/right.svg'

function Login() {
    const [ isLog , setisLog ] = useState('false')
    function changeToSign(){
        const hideLog = document.getElementById('Lme');
        const fliP = document.getElementById('divCon');
        const Signshow = document.getElementById('Lme2');
        fliP.style.gridTemplateColumns = 'repeat(2, 1fr)';
        hideLog.style.display = 'none';
        Signshow.style.display = 'block';
    }
    const toggleVisibility  = ()=>{
        setisLog(!isLog)
    }
  return (
    <div style={{'minHeight':'700px'}}>
        <h1>Login</h1>
        <div className='loginContainer'>
                <div id='divCon'>
                    <div className='Lme' id='Lme'>
                        <div>
                            <div id='item1'>   
                            <h1>Login</h1>
                            <br />
                            <p>user name</p>
                            
                            <input type="text" name="" id="" />
                            
                            <br />
                            <p>password</p>
                            <input type="text" name="" id="" />
                            {/* <br />
                            <p>email</p>
                            <input type="text" name="" id="" />
                            <br />
                            <p>date of birt</p>
                            {/* <input type="text" name="" id="" /> 
                            <input type="date" class="" /> */}
                            </div>
                        </div>
                    </div>

                    <div className='Rme' id='Rme'>
                        <div className='SignCon'>
                            <h1>                
                                Signup
                            </h1>
                            <div>
                                <p>if you not have an ID you let SignUp here</p>
                                <a onClick={changeToSign}><img src={Leftfa} width={80} height={80} alt=""/></a>
                            </div>
                        </div>
                    </div>

                    <div className='Lme2' id='Lme2' style={{'display':'none'}}>
                        <div>
                            <div id='item2'>   
                            <h1>Singup</h1>
                            <br />
                            <p>user name</p>
                            
                            <input type="text" name="" id="" />
                            
                            <br />
                            <p>password</p>
                            <input type="text" name="" id="" />
                            <br />
                            <p>email</p>
                            <input type="text" name="" id="" />
                            <br />
                            <p>date of birt</p>
                            {/* <input type="text" name="" id="" /> */}
                            <input type="date" class="" />
                            </div>
                        </div>
                    </div>
                </div>

        </div>
    </div>
  )
}

export default Login