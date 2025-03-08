import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
const ip = '192.168.1.196'
const Profile = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupOpenUsername, setIsPopupOpenUsername] = useState(false);
  const [usernameS, setUsernameS] = useState(null);
  const [first, setFirst] = useState(0);
  const [last, setLast] = useState(0);
  const [alldata, setAlldata] = useState([]);
  const [email, setemail] = useState(null);
  const [signupDate, setsignupDate] = useState(null);
  const [birstDate, setbirstDate] = useState(null);
  const [age, setAge] = useState(null);
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem("userid") || "");
  const [imageUser,setImageUser] = useState("https://img.icons8.com/?size=100&id=7819&format=png&color=000000")
  const [loading, setLoading] = useState(true);
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  const togglePopupUsername = () => {
    setIsPopupOpenUsername(!isPopupOpen);
  };
const getImage = async () => {
  const userId = localStorage.getItem('userid');
  if (!userId) {
    console.error('User ID not found in localStorage.');
    setLoading(false);
    return;
  }
  try {
    const response = await axios.get(`https://${ip}:5000/images/${userId}`);
    setImageUser(`https://${ip}:5000/${response.data.imagePath}`);
  } catch (error) {
    console.log('Error fetching data:');
  } finally {
    setLoading(false);
  }
};
getImage();
useEffect(() => {
  console.log("UserID:", userId);
  if (!userId) {
    console.warn("UserID is missing!");
    return;
  }
  const getAnalyze = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://${ip}:5000/analyze/${userId}`);
      setAlldata(response.data.A || []);
      setFirst(response.data.F.AnalyzeLevel || "");
      setLast(response.data.L.AnalyzeLevel || "");
    } catch (error) {
      console.log("Error fetching data:");
    } finally {
      setLoading(false);
    }
  };
  getAnalyze();
}, []);


useEffect( () => {
  console.log("UserID:", userId);
  if (!userId) {
    console.warn("UserID is missing!");
    return;
  }
  const fEda = async()=>{
    try {
      const response = await axios.get(`https://${ip}:5000/analyze/${userId}`);
      const formattedData = response.data.A.map(item => ({
        AnalyzeLevel: item.AnalyzeLevel,
        createdAt: dayjs(item.createdAt).format("DD-MM-YYYY"),
      }));
      setData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  fEda()
}, []);

const calculateAge = (birthdate) => {
  const birthDate = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }
  return age;
};

const fetchData = async () => {
  try {
    const response = await axios.get(`https://${ip}:5000/user/${userId}`);
    setUsernameS(response.data.user.username);
    setemail(response.data.user.email);
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
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
fetchData();

  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = (scrollTop / docHeight) * 100;
    setScrollProgress(scrollPercentage);
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <div
    className={`min-h-screen p-5 bg-gradient-to-r ${!scrolled ? 'from-black via-purple-950 to-blue-900' :'from-indigo-400 via-blue-300 to-blue-900'} animate-gradient-x `}
    >
      <div className="flex flex-col rounded-lg shadow-lg space-y-3 md:mx-[5vw] p-3 my-20 bg-[url('https://192.168.1.196:5173/image/bfim2.png')] bg-cover bg-center">
        <div className="flex flex-col border-2 bg-[url('https://192.168.1.196:5173/image/bgim.png')] bg-cover bg-center  rounded-lg mx-0 ">
          <div className="flex  text-center md:w-fit m-0  rounded-br-lg">
            <p className="md:text-2xl md:px-3 rounded-tl-lg rounded-br-lg bg-blue-800">
              <span className="text-white md:text-3xl">ID: {userId}</span>
            </p>
          </div>
          <div className="flex md:m-3 items-center justify-center my-auto md:space-x-16">
            <button className="text-black px-6 py-2 rounded-full" onClick={togglePopup}>
              <div className='md:w-72 w-48 shadow-2xl rounded-full aspect-square overflow-hidden'>
                <img 
                    className="rounded-full object-cover  w-full h-full" 
                    src={imageUser} 
                    alt={`Profile of ${usernameS}`}
                  />
              </div>
              {isPopupOpen && <Popup onClose={togglePopup} userId={userId} />}
            </button>
            <div className="flex flex-col justify-center space-y-3 items-start md:text-3xl">
              <h2 className='text-black md:text-6xl font-bold'>  
                  {usernameS}
                </h2>
              <p className='text-black'>วันที่สมัคร: {signupDate}</p>
              <p className='text-black'>อีเมล: {email}</p>
              <p className='text-black'>อายุ: {age}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-row bg-white border-1 rounded-lg">
          <div className="flex md:flex-col bg-[url('https://192.168.1.196:5173/image/bgim.png')] bg-cover bg-center w-full mx-auto p-3 flex-col space-y-2 md:space-y-0 justify-center items-center  h-full">
            <div className='bg-blue-500 my-1 text-7xl space-y-5 text-white md:w-[240px] h-40 p-3 md:mx-5 rounded-lg'>
              <p className='text-20px text-start'> การวิเคราะห์ครั้งแรก  </p>
              <div className='mx-auto'>
                {first}
              </div>
            </div>
            <div className='bg-blue-500  text-7xl space-y-5 text-white md:w-[240px] h-40 p-3 md:mx-5 rounded-lg'>
              <p className='text-20px text-start'>การวิเคราะห์ครั้งล่าสุด</p>
              <div>
                {last}
              </div>
            </div>
          </div>
          <div className=" w-full mx-auto  my-auto p-3 overflow-y-auto  rounded-lg h-[180px] min-h-[340px]" style={{scrollbarWidth: 'none',paddingLeft: '100px',scrollbarColor: '#4B5563 #F3F4F6'}}>
            <ul>
              {alldata.map((item) => {
                let level;
                if (item.AnalyzeLevel >= 4) {
                  level = "รุนแรง";
                } else if (item.AnalyzeLevel === 3) {
                  level = "ค่อนแย่";
                } else if (item.AnalyzeLevel === 2) {
                  level = "ค่อนดี";
                } else {
                  level = "ปกติ";
                }
                let Rec;
                if (item.AnalyzeLevel >= 4) {
                  Rec = "ยืดกล้ามเนื้อ";
                } else if (item.AnalyzeLevel === 3) {
                  Rec = "สร้างความแข็งแรงให้กล้ามเนื้อ";
                } else if (item.AnalyzeLevel === 2) {
                  Rec = "ปรับท่าทางให้เหมาะสม";
                } else {
                  Rec = "รักษาสภาพ";
                }
                return (
                  <div key={item._id} className="bg-[url('https://192.168.1.196:5173/image/bgim4.png')] bg-cover bg-center p-3 border-t-2 border-b-2">
                    <li>อาการ: {` ${item.AnalyzeLevel} (${level})`}</li>
                    <li>วันที่: {dayjs(item.createdAt).format('YYYY-MM-DD')}</li>
                    <li>ควร: {Rec}</li>
                  </div>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-[url('https://192.168.1.196:5173/image/bfim2.png')] p-2 w-[80vw] rounded-lg mx-auto">
        <div className="flex flex-col rounded-lg shadow-lg  p-3 bg-white">
          <h3 className='text-indigo-400'>
            กราฟผลการวิเคราะห์อาการ
          </h3>
          <ResponsiveContainer className='min-h-[300px]' >
            <LineChart data={data.slice(-5)}>
              <XAxis dataKey="createdAt" stroke="#8884d8" />
              <YAxis domain={[0, Math.max(...data.slice(-3).map(d => d.AnalyzeLevel), 0)*1.5]} />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Line type="monotone" dataKey="AnalyzeLevel" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
const Popup = ({ onClose, userId }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState('');
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };
const handleUpload = async () => {
  if (!file) {
    setStatus('Please select a file first');
    return;
  }
  const formData = new FormData();
  formData.append('image', file);
  formData.append('userId', userId);
  try {
    const response = await axios.post(`https://${ip}:5000/upload/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    setStatus(response.data.message);
    if (response.status === 200){
      window.location.reload();
    }
    onClose();
  } catch (error) {
    setStatus('Failed to upload image');
  }
};

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()} // Stop event propagation here
      >
        <h2 className="text-lg font-bold mb-4">Change Profile Image</h2>
        <input type="file" onChange={handleFileChange} />
        {preview && <img src={preview} alt="Preview" className="flex my-4 w-32 h-32 object-cover mx-auto" />}
        <div className="space-x-5 mt-5">
          <button onClick={handleUpload} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Submit
          </button>
          <button onClick={onClose} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
            Close
          </button>
        </div>
        {status && <p className="mt-4 text-red-500">{status}</p>}
      </div>

    </div>
  );
};
export { Profile, Popup };
