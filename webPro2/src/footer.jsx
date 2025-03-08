import React from 'react'
import './footer.css'
import FaceB from './assets/facebook.svg'
import Line from './assets/line.svg'
import Mail from './assets/email.svg'
function Footer() {
  return (
    <div className=''>
        <div className='flex flex-col bg-black text-white w-full'>
            <div className='border-b-2'>
                <p className=''>Bye Hunchback</p>
                <p className=''>ⓒ 2024 Bye Hunchback for Rehab</p>
                <p className='text-5px md:hidden'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem perferendis delectus nemo doloribus asperiores provident magnam error dolore harum libero. Exercitationem ullam illum iusto rerum vero voluptates nulla, nisi reprehenderit.
                </p>
                {/* <hr /> */}
            </div>
            <div className='flex w-full md:space-x-8 px-5 md:px-0 justify-between text-10px p-3'>
                <div className='text-5px md:text-10px'>
                    <div className=' w-20 md:w-80'>
                        <h4 className=''>describe</h4>
                        <p className='text-5px md:text-10px'>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem perferendis delectus nemo doloribus asperiores provident magnam error dolore harum libero. Exercitationem ullam illum iusto rerum vero voluptates nulla, nisi reprehenderit.
                        </p>
                    </div>
                </div>

                <div className='text-5px md:text-10px'>
                    <div className='text-5px md:text-10px'>
                        <h4>service</h4>
                        <li>
                                Analyze
                        </li>
                        <li>
                                record
                        </li>
                    </div>
                </div>

                <div className='text-5px md:text-10px'>
                    <div>
                        <h4>Report</h4>
                        <div className='text-5px md:text-10px'>
                                <div>   
                                    <img src={Mail} alt="My Icon" width={10} height={10} style={{"paddingBottom":'0px'}} />
                                    <p>Email:Byhunchback_report<br/>@gmail.com</p>
                                </div>
                            </div>
                    </div>
                </div>

                <div className='text-5px md:text-10px'>
                    <div >
                        <h4>contract</h4>
                        <div className='text-5px md:text-10px'>
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