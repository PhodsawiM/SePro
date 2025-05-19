import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ImgNha from './assets/img.svg';
import IRight from './assets/right.svg';
import dayjs from 'dayjs';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { GlobalContext } from "./context/GlobalContext";
const Profile = () => {
  const { ip } = useContext(GlobalContext);
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
  const bgImageds = `bg-[url('https://${ip}/image/bgim.png')]`
  console.log(bgImageds)
  const [userId, setUserId] = useState(localStorage.getItem("userid") || "");
  const [imageUser,setImageUser] = useState("https://img.icons8.com/?size=100&id=7819&format=png&color=000000")
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0); 
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


useEffect(() => {
  if (!userId) {
    console.warn("UserID is missing!");
    return;
  }

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://${ip}:5000/analyze/${userId}`);
      const formatted = response.data.A.map(item => ({
        AnalyzeLevel: item.AnalyzeLevel,
        createdAt: item.createdAt,
        displayDate: dayjs(item.createdAt).format("DD-MM-YYYY"),
      }));
      setData(formatted);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  fetchData();
}, [userId]);

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
  const bgImage = `bg-[url('https://${ip}:5173/image/bfim2.png')]`;
  const bgImage2 = `bg-[url('https://${ip}:5173/image/bgim.png')]`;
  const bgImage4 = `bg-[url('https://${ip}:5173/image/bgim6.png')]`;
  const [exercises, setExercises] = useState([]);
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(`https://${ip}:5000/exercises/`);
        setExercises(response.data.data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExercises();
  }, []);
  
  const startOfWeek = dayjs().startOf('week').subtract(weekOffset, 'week');
  const endOfWeek = startOfWeek.endOf('week');

  // ⏳ Filter data within this week
  const weekData = data.filter(item =>
    dayjs(item.createdAt).isAfter(startOfWeek) &&
    dayjs(item.createdAt).isBefore(endOfWeek)
  );

  const maxY = Math.max(...weekData.map(d => d.AnalyzeLevel), 0) * 1.5;
  return (
    <div
    className={`min-h-screen p-2 bg-gradient-to-r ${!scrolled ? 'from-black via-purple-950 to-blue-900' :'from-indigo-400 via-blue-300 to-blue-900'} animate-gradient-x `}
    >
      <div className={`flex flex-col rounded-lg shadow-lg space-y-2 md:mx-[5vw] p-3 my-5 bg-cover bg-center`} style={{ backgroundImage: `url('https://${ip}:5173/image/bfim2.png')` }}>
        <div className={`flex flex-col border-2 bg-cover bg-center  rounded-lg mx-0 `} style={{ backgroundImage: `url('https://${ip}:5173/image/bgim.png')` }}>
          {/* <div className="flex  text-center md:w-fit m-0  rounded-br-lg">
            <p className="md:text-2xl md:px-3 rounded-tl-lg rounded-br-lg bg-blue-800">
              <span className="text-white md:text-3xl">ID: {userId}</span>
            </p>
          </div> */}
          <div className="flex  flex-col md:m-3 items-center justify-center my-auto md:space-x-16">
            <div className='flex flex-col md:flex-row'>
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
              <div className="flex flex-col justify-center space-y-3 items-start md:text-2xl">
                <h2 className='text-black md:text-6xl font-bold'>  
                    {usernameS}
                  </h2>
                <hr className='border-black w-full' />
                <p className='text-black'>วันที่สมัคร: {signupDate}</p>
                <p className='text-black'>อีเมล: {email}</p>
                <p className='text-black'>อายุ: {age}</p>
              </div>
            </div>
            <div className='flex space-x-5 mx-3'>
            <div className='bg-gray-600 text-4xl md:text-7xl  text-white md:w-[240px] h-10 md:mx-5 rounded-lg '>
              <p className='text-[15px] md:text-[20px] text-center mx-2'> การวิเคราะห์ครั้งแรก  <span className='text-3xl'>{first}</span></p>
            </div>
            <div className='bg-gray-600 text-4xl md:text-7xl  text-white md:w-[240px] h-10 md:mx-5 rounded-lg'>
              <p className='text-[15px] md:text-[20px] text-center mx-2'>การวิเคราะห์ครั้งล่าสุด <span className='text-3xl'>{last}</span></p>
            </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row p-3 border-1 rounded-lg"
        style={{ backgroundImage: `url('https://${ip}:5173/image/bgim6.png')` }}>
          <div className=" w-full mx-auto my-auto p-3 overflow-y-auto  rounded-lg h-[180px] min-h-[340px]" style={{scrollbarWidth: 'none',paddingLeft: '100px',scrollbarColor: '#4B5563 #F3F4F6'}}>
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
                  <div key={item._id} className={`rounded-lg bg-cover bg-center p-3 border-t-2 border-b-2`}
                  style={{ backgroundImage: `url('https://${ip}:5173/image/bgim4.png')` }}>
                    <li>อาการ: {` ${item.AnalyzeLevel} (${level})`}</li>
                    <li>วันที่: {dayjs(item.createdAt).format('YYYY-MM-DD')}</li>
                    <li>ควร: {Rec}</li>
                  </div>
                );
              })}
            </ul>
          </div>
          <div className={`flex md:flex-col  bg-cover bg-center w-full mx-auto p-3 flex-col space-y-2 md:space-y-0 justify-center items-center  h-full`} 
          style={{ backgroundImage: `url('https://${ip}:5173/image/bgim.png')` }}>
            <div className='w-full mx-auto my-auto p-3 overflow-y-auto  rounded-lg h-[180px] min-h-[340px]'>
              <h1 className='md:text-3xl'>
                แนะนำให้ออกกำลังกายท่าต่อไปนี้
              </h1>
            {loading ? (
                <p>Loading...</p>
              ) : (
                exercises
                  .filter((exercise) => {
                    if (last === 1) {
                      return ["สร้างความแข็งแรงให้กล้ามเนื้อ"].includes(exercise.model_url);
                    } else if (last === 2) {
                      return ["สร้างความแข็งแรงให้กล้ามเนื้อ"].includes(exercise.model_url);
                    }else if (last === 3) {
                      return ["สร้างความแข็งแรงให้กล้ามเนื้อ"].includes(exercise.model_url);
                    }else if (last === 4) {
                      return ["ยืดกล้ามเนื้อ"].includes(exercise.model_url);
                    }
                      return false;
                  })
                  .map((exercise) => (
                    <ExerciseCard key={exercise._id} exercise={exercise} />
                  ))
              )}

            </div>
          </div>
        </div>
      </div>
      <div className={`p-2 w-[85vw] rounded-lg mx-auto`} style={{ backgroundImage: `url('https://${ip}:5173/image/bfim2.png')` }}>
      <div className="flex flex-col rounded-lg shadow-lg p-3 bg-white">
        <h3 className='text-indigo-400 mb-2'>
          กราฟผลการวิเคราะห์อาการ
        </h3>

        {/* Week Controls */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setWeekOffset(weekOffset + 1)}
            className="px-4 py-1 bg-gray-200 hover:bg-gray-300 rounded"
          >
            ⬅️ สัปดาห์ก่อนหน้า
          </button>
          <span className="text-sm font-medium">
            {startOfWeek.format('DD MMM')} - {endOfWeek.format('DD MMM YYYY')}
          </span>
          <button
            onClick={() => setWeekOffset(Math.max(weekOffset - 1, 0))}
            disabled={weekOffset === 0}
            className="px-4 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
          >
            สัปดาห์ถัดไป ➡️
          </button>
        </div>

        {/* Chart */}
        <ResponsiveContainer className='min-h-[300px]'>
          <LineChart data={weekData}>
            <XAxis dataKey="displayDate" stroke="#8884d8" />
            <YAxis domain={[0, maxY]} />
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
const ExerciseCard = ({ exercise }) => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const { ip, setGlobalVariable } = useContext(GlobalContext);
useEffect(() => {
  const fetchImages = async () => {
    try {
      const response = await axios.get(`https://${ip}:5000/exercises/${exercise._id}`);
      console.log(response.data.data)
      setImages(response.data.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };
  fetchImages();
}, [exercise._id]);
  const goToPage = async () => {
    await localStorage.setItem('exerciseName',exercise.exercisename);
    await localStorage.setItem('exerciseId',exercise._id);
    await localStorage.setItem('exercisereplete',exercise.replete);
    await localStorage.setItem('exerciseset',exercise.set);
    if (localStorage.getItem('exerciseName') === 'sway head'){
      navigate('/PPcam2');
    }else if(localStorage.getItem('exerciseName') === 'Squat'){
      navigate('/PPcam3');
    }else if(localStorage.getItem('exerciseName') === 'Shoulder Dislocations'){
      navigate('/PPcam4');
    }else if(localStorage.getItem('exerciseName') === 'Bridge'){
      navigate('/PPcam5');
    }else if(localStorage.getItem('exerciseName') === 'Reverse Flys'){
      navigate('/PPcam6');
    }else if(localStorage.getItem('exerciseName') === 'Chest Opener'){
      navigate('/recsv3');
    }
  };
  const bgImage = `bg-[url('https://${ip}:5173/image/bgim.png')]`;
  return (
    <div className={`flex  bg-cover mx-auto bg-center flex-col md:flex-row justify-between shadow-lg my-2 space-y-4 border-gray-500 rounded-lg p-2`}
    style={{ backgroundImage: `url('https://${ip}:5173/image/bgim.png')` }}>
      <div className='flex mx-auto min-w-24 md:max-w-[150px] border-2 border-black rounded-lg'>
        {images.length ? (
          <img className='max-h-[800px] object-cover rounded-lg'
            src={`https://${ip}:5000${images[0].imagePath}`}
            alt={images[0].filename}
            onError={(e) => { e.target.onerror = null; e.target.src = ImgNha; }}
            />
        ) : (
          <img src={ImgNha} alt="Placeholder" /> 
        )}
      </div>
      <div className="flex  flex-col justify-center items-center">
        <div className='flex flex-col items-start'>
          <h3 className='font-bold text-black '>{exercise.exercisename}</h3>
          {/* <div className='text-start'>
            <p className='text-[15px] md:text-28px max-w-[800px]'>{exercise.describtion}</p>
          </div> */}
        </div>
        <div className='flex flex-row m-1 my-auto space-x-5 mt-3'>
          <div className='flex bg-blue-400 text-white md:text-2xl items-center rounded-lg h-10 w-auto  px-2'>
            <p>rep</p> <span className='md:text1xl text-green-300'>{exercise.replete}</span>
          </div>
          <div className='flex bg-blue-400 text-white md:text-2xl items-center rounded-lg h-10 w-auto  px-2'>
            <span className='md:text-1xl text-green-300'>{exercise.set}</span><p>set</p>
          </div>
        </div>
      </div>
      <div className='my-auto mx-auto'>
        <div className='flex bg-red-500 h-[50spx] md:h-[80px] mx-auto mt-1 rounded-lg md:max-w-[50px] max-w-full md:ml-8 md:min-w-14'>
          <button onClick={goToPage}>
            <img className='w-20 h-10' src={IRight} />
          </button>
        </div>
      </div>
    </div>
  );
};
const Popup = ({ onClose, userId }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState('');
  const { ip, setGlobalVariable } = useContext(GlobalContext);
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
        <h2 className="text-lg font-bold mb-4">เปลี่ยนรูปโปรไฟล์</h2>
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
