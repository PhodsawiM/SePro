import React from 'react'
import './footer.css'
import FaceB from './assets/facebook.svg'
import Line from './assets/line.svg'
import Mail from './assets/email.svg'
function Footer() {
  return (
    <div style={{'width':'100%'}}>
        <div className='foolter'>
            <div>
                <p className='foolter'>Bye Hunchback</p>
                <p className='Csub'>ⓒ 2024 Bye Hunchback for Rehab</p>
                <hr />
            </div>
            <div className='foolter-bf'>
                <div className='itemF'>
                    <div>
                        <h4>describe</h4>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem perferendis delectus nemo doloribus asperiores provident magnam error dolore harum libero. Exercitationem ullam illum iusto rerum vero voluptates nulla, nisi reprehenderit.
                        </p>
                    </div>
                </div>

                <div className='itemF'>
                    <div className='serC'>
                        <h4>service</h4>
                        <li>
                                Analyze
                        </li>
                        <li>
                                record
                        </li>
                    </div>
                </div>

                <div className='itemF'>
                    <div>
                        <h4>Report</h4>
                        <div className='itemFitem'>
                                <div>   
                                    <img src={Mail} alt="My Icon" width={10} height={10} style={{"paddingBottom":'0px'}} />
                                    <p>Email:Byhunchback_report<br/>@gmail.com</p>
                                </div>
                            </div>
                    </div>
                </div>

                <div className='itemF'>
                    <div >
                        <h4>contract</h4>
                        <div className='itemFitem'>
                            <div>   
                                <img src={FaceB} alt="My Icon" width={10} height={10} style={{"paddingBottom":'0px'}} />
                                <p>By hunchback</p>
                            </div>
                            <div>
                                <img src={Line} alt="My Icon" width={10} height={10} style={{"paddingBottom":'0px'}} />
                                <p>ID:ByHunchback</p>
                            </div>
                            <div>
                                <img src={Mail} alt="My Icon" width={10} height={10} style={{"paddingBottom":'0px'}} />
                                <p>Byhunchback@gmail.com</p>
                            </div>
                        </div>
       
                    </div>
                </div>

            </div>
        </div>
    </div>
  )
}

export default Footer