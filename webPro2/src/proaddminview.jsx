import React, { useState,useEffect,useContext } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { GlobalContext } from "./context/GlobalContext";
function ProfileA() {
  const { ip, setGlobalVariable } = useContext(GlobalContext);
    // const ip = '192.168.1.194'
    const { userId } = useParams();
    const [usernameS, setUsernameS] = useState(null);
    const [first, setFirst] = useState(0);
    const [last, setLast] = useState(0);
    const [age, setAge] = useState(null);
    const [email, setemail] = useState(null);
    const [signupDate, setsignupDate] = useState(null);
    const [birstDate, setbirstDate] = useState(null);
    const [imageUser,setImageUser] = useState("https://img.icons8.com/?size=100&id=7819&format=png&color=000000")
    // const fetchData = async () => {
    //     try {
    //       const response = await axios.get(`https://192.168.1.194:5000/user/${userId}`); 
    //       // const imgnha = await axios.get(`https://192.168.1.194:5000/user/${userId}`); 
    //       setUsernameS(response.data.user.username)
    //       setImageUser(`https://192.168.1.194:5000/${response.data.image.imagePath}`)
    //       console.log(response.data.image.imagePath); // Handle the response data as needed
    //     } catch (error) {
    //       console.error('Error fetching data:', error); // Handle errors
    //     }
    //   };
    //   fetchData();
    // useEffect(() => {
      const calculateAge = (birthdate) => {
        const birthDate = new Date(birthdate);
        const today = new Date();
      
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
  
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          age--;
        }
        console.log(age)
        return age;
      };
      const fetchData = async () => {
        try {
          const response = await axios.get(`https://${ip}:5000/user/${userId}`);
          setUsernameS(response.data.user.username);
          setemail(response.data.user.email);
          // setsignupDate(response.data.user.createdAt);
          const SetUserdata = ()=>{
            const dateString = response.data.user.createdAt;
            const date = new Date(dateString);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
    
            setsignupDate(`${year}-${month}-${day}`);
            
            const dateStringB = response.data.user.dateOfBirth;
            const dateb = new Date(dateStringB);
            const dayb = dateb.getDate().toString().padStart(2, '0');
            const monthb = (dateb.getMonth() + 1).toString().padStart(2, '0');
            const yearb = dateb.getFullYear();
    
            setbirstDate(`${yearb}-${monthb}-${dayb}`);
            console.log(birstDate)
            setAge(calculateAge(birstDate))
            setImageUser(`https://${ip}:5000/${response.data.image.imagePath}`)
          }
          SetUserdata()
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    // }, [userId]);
    useEffect(() => {
      const getAnalyze = async () => {
        try {
          const response = await axios.get(`https://${ip}:5000/analyze/${userId}`);
          // console.log(response.data.F.AnalyzeLevel)
          const SetData = ()=>{
            setFirst(`${response.data.F.AnalyzeLevel}`);
            setLast(`${response.data.L.AnalyzeLevel}`);
          }
          // console.log(`Fetched image path: ${response.data}`);
          SetData()
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      getAnalyze();
    }, []);
  return (
    <div className='flex  flex-col items-center justify-center min-h-screen bg-gradient-to-r from-black via-purple-950 to-blue-900 animate-gradient-x'>
        <h1 className='text-7xl font-bold text-white'>รายละเอียดผู้ใช้</h1>
       <div className='flex flex-col space-y-3 mx-auto w-[80vw] rounded-lg p-3 my-20 ' style={{minHeight:'800px' , backgroundImage: `url('https://${ip}:5173/image/bfim2.png')` }}>
        <div className='flex flex-col border-2 rounded-lg mx-0' style={{height:'380px',width:'100%'}}>
            <div className='flex border-r-4 border-b-4 text-center w-fit m-0 rounded-br-lg'>
                <p className='text-2xl px-3 m-1'><span className='text-white text-[20px] md:text-3xl'>ID: {userId}</span><span className='text-white'></span></p>
            </div>
            <div className='flex m-3 md:m-3 items-center justify-center my-auto md:space-x-16 space-x-0'>
            <div className='w-72 aspect-square overflow-hidden'>
                <img 
                    className="rounded-full object-cover w-full h-full" 
                    src={imageUser} 
                    alt={`Profile of ${usernameS}`}
                  />
              </div>
                <div className='flex text-white justify-start items-start text-2xl md:text-3xl flex-col'>
                    <p className='text-blue-500'>ชื่อผู้ใช้: <span className='text-white'>{usernameS}</span></p>
                    <p className='text-blue-500'>อีเมล: <span className='text-white'>{email}</span></p>
                    <p className='text-blue-500' >อายุ: <span className='text-white'>{age}</span></p>
                </div>
            </div>
        </div>
        <div className='bg-white border-1 rounded-lg  h-full' style={{height:'380px' , backgroundImage: `url('https://${ip}:5173/image/bgim.png')`}}>
        <div className='flex md:flex-row flex-col space-y-2 md:space-y-0 justify-center items-center  h-full'>
            <div className='bg-blue-500 text-7xl space-y-5 text-white w-60 h-40 p-3 md:mx-5 rounded-lg'>
              <p className='text-20px text-start'>first analyze</p>
              <div className='mx-auto'>
                {first}
              </div>
            </div>
            <div className='bg-blue-500 text-7xl space-y-5 text-white w-60 h-40 p-3 md:mx-5 rounded-lg'>
              <p className='text-20px text-start'>latest analyze</p>
              <div>
                {last}
              </div>
            </div>
          </div>
        </div>
       </div>
    </div>

  )
}

export default ProfileA