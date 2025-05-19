import react , {useContext , useState ,useEffect} from 'react'
import './img/im1.png'
import './img/im1.png'
import './home.css'
import {Popup} from './test'
import SVG from './assets/img.svg'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GlobalContext } from "./context/GlobalContext";
function Home() {
    const { ip, setGlobalVariable } = useContext(GlobalContext);
  return (
    <div
    className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-black via-purple-950 to-blue-900  animate-gradient-x `}
    >
        <div className='HmaBox'>
            <div className='p-3'>
                <h1 className='text-4xl md:text-6xl font-bold p-2 text-white'>ยินดีต้อนรับสู่ Bye Hunchback</h1>
                <p className='text-white  text-[10px] md:text-[15px]'>เว็บไซต์นี้สร้างขึ้นเพื่อช่วยบำบัดอาการผิดปกติของท่าทางที่ผิดปกติ</p>
            </div>
            <div className='md:mx-36'>
                <div className='flex m-4 space-x-3' >
                    <div className=' bg-white shadow-lg text-[10px] md:text-2xl rounded-lg min-h-36 md:min-h-72 w-full flex-wrap'>
                        <div className="bg-[url('https://192.168.1.194:5173/image/bgim3.png')] bg-cover bg-center flex  flex-col p-3 space-y-5">
                            <span className='text-start font-bold'>
                                ผลเสียของการหลังค่อม
                            </span>
                            <p>
                            การหลังค่อมส่งผลเสียต่อสุขภาพ ทั้งปวดกล้ามเนื้อเรื้อรัง กระดูกสันหลังผิดรูป และเสี่ยงต่อภาวะหมอนรองกระดูกเสื่อม นอกจากนี้ยังทำให้ปอดขยายตัวไม่เต็มที่ ส่งผลให้หายใจลำบากและรู้สึกอ่อนเพลีย ระบบไหลเวียนโลหิตอาจติดขัด ทำให้เกิดอาการชาและเพิ่มความเสี่ยงต่อโรคหัวใจ อีกทั้งยังส่งผลต่อบุคลิกภาพและความมั่นใจ การป้องกันทำได้โดยนั่งและยืนให้ถูกต้อง ออกกำลังกายเสริมกล้ามเนื้อ ยืดเหยียดร่างกาย และหลีกเลี่ยงการก้มหน้ามองจอนานๆ เพื่อสุขภาพที่ดีในระยะยาว
                            </p>
                        </div>
                    </div>
                    <div className='w-72 shadow-lg aspect-square overflow-hidden'>
                        <img 
                            className="rounded-lg object-cover w-full h-full" 
                            src={'/public/image/Hunchback-1.webp'} 
                        />
                    </div>  
                </div>
                <div  className='flex m-4 space-x-3' >
                <div className='w-72 aspect-square overflow-hidden'>
                        <img 
                            className="rounded-lg object-cover w-full h-full" 
                            src={'/public/image/exercise.avif'} 
                        />
                    </div>
                    <div className=' bg-white shadow-lg text-[10px] md:text-2xl rounded-lg min-h-36 md:min-h-72 w-full flex-wrap'>
                    <div className="bg-[url('https://192.168.1.196:5173/image/bgim3.png')] bg-cover bg-center flex flex-col p-3 space-y-5">
                            <span className='text-end font-bold'>
                                แก้ไขได้ไหม
                            </span>
                            <p>
                            อาการหลังค่อมยังสามารถบำบัดและแก้ไขได้ด้วยการออกกำลังกายที่เหมาะสม การเสริมสร้างกล้ามเนื้อหลัง ไหล่ และแกนกลางลำตัว รวมถึงการยืดเหยียดอย่างสม่ำเสมอ จะช่วยปรับบุคลิกภาพ ลดอาการปวดเมื่อย และทำให้ร่างกายแข็งแรงขึ้น เพียงเริ่มดูแลตัวเองตั้งแต่วันนี้ คุณก็สามารถกลับมามีท่าทางที่ดีและสุขภาพที่แข็งแรงได้! 💪😊
                            </p>
                        </div>
                    </div>
                </div>
                <div className='flex m-4 space-x-3 shadow-lg rounded-lg' >
                    <div className=' bg-white text-[10px] md:text-2xl rounded-lg min-h-36 md:min-h-72 w-full flex-wrap'>
                    <div className='bg-[url("https://192.168.1.196:5173/image/bgim3.png")] bg-cover bg-center flex flex-col p-3 space-y-5'>
                            <span className='text-start font-bold'>
                                มาเริ่มดูแลตัวเองตั้งแต่วันนี้
                            </span>
                            <p>
                            อย่าปล่อยให้หลังค่อมทำลายสุขภาพของคุณ! การนั่งหรือยืนผิดท่านานๆ อาจทำให้ปวดหลังเรื้อรัง หายใจติดขัด และเสียบุคลิกภาพ แต่คุณสามารถแก้ไขได้ง่ายๆ ด้วยการออกกำลังกายเป็นประจำ เพียงวันละไม่กี่นาที ฝึกยืดเหยียดกล้ามเนื้อ เสริมความแข็งแรงให้หลังและแกนกลางลำตัว แล้วคุณจะรู้สึกถึงความเปลี่ยนแปลง ทั้งความมั่นใจ บุคลิกที่ดีขึ้น และสุขภาพที่แข็งแรง มาเริ่มดูแลตัวเองตั้งแต่วันนี้! เพราะหลังที่ตรง คือก้าวแรกของชีวิตที่แข็งแรงและมั่นคง
                            </p>
                        </div>
                    </div>
                    <div className='w-72 aspect-square shadow-lg overflow-hidden'>
                        <img 
                            className="rounded-lg object-cover w-full h-full" 
                            src={'/public/image/re.jpg'} 
                        />
                    </div>
                </div>
            </div>
        </div>
        <hr className='mx-auto' />
        <div>
            <button className='bg-blue-900 hover:bg-blue-200 transition duration-500 shadow-lg  text-white md:text-7xl p-3 m-3 rounded-full' >
                <a href="/excercise" className='hover:text-blue-900 w-full p-4'>เริ่ม</a>
            </button>
        </div>
    </div>
  )
}
export default Home