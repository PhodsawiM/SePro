import React from 'react'
import './img/im1.png'
import './img/UWU2_2.png'
import './home.css'
import SVG from './assets/img.svg'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Exercise from './exercise'
function Home() {
  return (
    <div style={{'backgroundColor':'#ffffff','minHeight':'800px'}}>
        <div className='HmaBox'>
            <div className='homeWelT'>
                <h1>Wecom to our site</h1>
                <p>this site is responce for rehab your posteral</p>
            </div>
            <div className='objecCon'>
                <div >
                    <div >
                        <h3>
                        content
                        </h3>
                        <p>
                        Example
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab, aliquam tempore sapiente dolorem numquam dolores amet nostrum quos quaerat ad a illum? Distinctio ullam amet, nam vel aut dolorem reiciendis.
                        </p>
                    </div>
                </div>
                <div >
                    <div>
                        <img style={{'width':'100%','height':'100%'}} src={SVG} alt="" />
                    </div>
                </div>
                <div>
                    <div className='ConR'>
                        <img style={{'width':'100%','height':'100%'}} src={SVG} alt="" />
                    </div>
                </div>
                <div>
                    <div className='ConL'>
                        <h3>
                            content
                        </h3>
                        <p>
                        Example
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab, aliquam tempore sapiente dolorem numquam dolores amet nostrum quos quaerat ad a illum? Distinctio ullam amet, nam vel aut dolorem reiciendis.
                        </p>
                    </div>
                </div>
                <div>
                    <div >
                        <h3>
                        content
                        </h3>
                        <p>
                        Example
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab, aliquam tempore sapiente dolorem numquam dolores amet nostrum quos quaerat ad a illum? Distinctio ullam amet, nam vel aut dolorem reiciendis.
                        </p>
                    </div>
                </div>
                <div>
                    <div>
                        <img style={{'width':'100%','height':'100%'}} src={SVG} alt="" />
                    </div>
                </div>
            </div>
        </div>

        <hr />
        <div>
            <button className='submit-btn' type='submit'>
                <a href="/excercise">Start</a>
            </button>
        </div>
    </div>

  )
}

export default Home