import React from 'react'
import './login.css'

function Login() {
    const container = document.getElementById('container2');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');
    registerBtn.addEventListener('click',()=>{
        container.classList.add('active');
    });
    loginBtn.addEventListener('click',()=>{
        container.classList.remove('active');
    });
  return (
    
    <div>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" />
        <div className='maBody'>
            <div className="container2" id='container2'>
                <div className="form-container sing-up">
                    <form>
                        <h1>
                            Create Account
                        </h1>
                        <div className='social-icons'>
                            <a href="" className='icon'><i class="fa-brands fa-google">hi</i></a>
                            <a href="" className='icon'><i class="fa-brands fa-google">hi</i></a>
                            <a href="" className='icon'><i class="fa-brands fa-google">hi</i></a>
                            <a href="" className='icon'><i class="fa-brands fa-google">hi</i></a>
                            <span> or use your email for register</span>
                            <input type="text" placeholder='name' />
                            <input type="email" placeholder='email' />
                            <input type="password" placeholder='password' />
                            <button id='register'>Signup</button>
                        </div>
                    </form>
                </div>
                <div className="form-container sing-in">
                    <form>
                        <h1>
                        sing-in
                        </h1>
                        <div className='social-icons'>
                            <span> or use your username for login</span>
                            <input type="text" placeholder='name' />
                            <input type="password" placeholder='password' />
                            <a href="">forgot password?</a><br />
                            <button id='login'>Signin</button>
                        </div>
                    </form>
                </div>
                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>
                                Wellcome Back!
                            </h1>
                            <p>
                                Enteer your personal details to use all of site features
                            </p>
                            <button className="hidden" id='login'>
                                Sing in
                            </button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1>
                                Hellow Friend!
                            </h1>
                            <p>
                                Register with your personal details to use all of site features
                            </p>
                            <button className="hidden" id='register'>
                                Sing up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login