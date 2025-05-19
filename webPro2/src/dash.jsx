import React, { useState, useEffect,useContext } from 'react';
import './dash.css';
import axios from 'axios';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { BarChart, Bar, LabelList, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie,Cell, LabelList as PieLabelList } from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, startOfMonth } from 'date-fns';
import { GlobalContext } from "./context/GlobalContext";
function Dash() {

  const { ip, setGlobalVariable } = useContext(GlobalContext);
  const [data, setData] = useState([]);
  const [data2, setData2] = useState();
  const [data3, setData3] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [Agecounted, setAgecounted] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState('');
  const [userLevels, setUserLevels] = useState([]);
  const [dataSelected, setdataSelected] = useState('age');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [UserIdssr,setUserIdss]= useState(null);
  const [Emails,setEmails]= useState(null);
  const handleChange = (event) => {
    setdataSelected(event.target.value);
  };
  const togglePopup = (UserIdss) => {
    setIsPopupOpen(!isPopupOpen);
    setUserIdss(UserIdss._id)
    setEmails(UserIdss.email)
  };
  const fetchUserLevels = async () => {
    try {
      const response = await axios.get(`https://${ip}:5000/latestLevels`);
      
      const levelCount = response.data.reduce((acc, level) => {
        const levelName = level.latestLevel; 
        acc[levelName] = (acc[levelName] || 0) + 1;
        return acc;
      }, {});
  
      const levelsData = Object.keys(levelCount).map(levelName => ({
        name: levelName,
        value: levelCount[levelName],
      }));

      const mostFrequentLevel = levelsData.reduce((max, current) => {
        return current.value > max.value ? current : max;
      });
  
      console.log("Most Frequent Level:", mostFrequentLevel); 
      setUserLevels(levelsData); 
  
    } catch (error) {
      setError(error);
    }
  };
  

  const fetchData = async () => {
    setLoading(true);
    const calculateAge = (dateOfBirth) => {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const isBirthdayPassed = 
        today.getMonth() > birthDate.getMonth() || 
        (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
      if (!isBirthdayPassed) {
        age -= 1;
      }
      return age;
    };
    const countAges = (data) => {
      return data.reduce((acc, item) => {
        acc[item.age] = (acc[item.age] || 0) + 1;
        return acc;
      }, {});
    };
    try {
      const response = await axios.get(`https://${ip}:5000/userData`);
      setData(response.data);
      response.data.forEach(item => {
        const age = calculateAge(item.dateOfBirth);
        item.age = age;
      });
      setAgecounted(countAges(response.data));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  const fetchDatass = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://${ip}:5000/CountExer`);
      setData3(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  

  const fetchUserData = async (formattedDate) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://${ip}:5000/dashData`);
      const rawData = response.data.data || [];
      const formattedDates = rawData.map(entry => {
        return new Date(entry.dateOfBirth).toISOString().split('T')[0];
      });

      const dateCount = formattedDates.reduce((acc, date) => {
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const data = Object.keys(dateCount).map(date => ({
        date,
        value: dateCount[date]
      }));

      const selectedMonth = formattedDate;
      const filteredData = data.filter(entry => entry.date.startsWith(selectedMonth));

      setData2(filteredData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(()=>{
    fetchData()
  },[isPopupOpen])
  useEffect(() => {
    if (selectedDate) {
      const formatted = format(startOfMonth(selectedDate), 'yyyy-MM');
      setFormattedDate(formatted);
    }
  }, [selectedDate]);

  const handleDateChange = (newDate) => {
    const formattedDate = format(newDate, 'yyyy-MM');
    setSelectedDate(newDate);
    fetchUserData(formattedDate);
  };

  const DeleteUser = async (id) => {
    try {
      await axios.delete(`https://${ip}:5000/deleteUser/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDatass();
    fetchUserLevels();
    fetchUserData(formattedDate);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  const renderCustomLabel = ({ name, value, percent }) => {
    // return `ระดับ : ${name} | จำนวน : ${(percent * 100).toFixed(1)}%`;
    return `${(percent * 100).toFixed(1)}%`;
  };

  // const [formData, setFormData] = useState({
  //   to: '',
  //   subject: '',
  //   text: ''
  // });

  // const handleChanges = (e) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({ ...prev, [name]: value }));
  // };





  return (
    <div className={`flex  flex-col items-center justify-center min-h-screen bg-gradient-to-r from-black via-purple-950 to-blue-900 animate-gradient-x`}>
      {/* <h1 className="text-7xl text-white font-bold">กระดานข้อมูล</h1> */}
      <div className="graphBox m-3 rounded-lg mx-auto px-0"
      style={{ backgroundImage: `url('https://${ip}:5173/image/bfim2.png')` }}>
        {/* <FormControl fullWidth className="p-3 mt-3"> */}
          {/* <InputLabel id="demo-simple-select-label">ตัวเลือก</InputLabel> */}
          {/* <Select */}
            {/* className="bg-white" */}
            {/* labelId="demo-simple-select-label" */}
            {/* id="demo-simple-select" */}
            {/* value={dataSelected} */}
            {/* label="Select an Option" */}
            {/* onChange={handleChange} */}
          {/* > */}
            {/* <MenuItem value={'sign'}>อัตราการสมัคร</MenuItem> */}
            {/* <MenuItem value={'age'}>อายุ</MenuItem> */}
            {/* <MenuItem value={'level'}>ระดับของผู้ใช้</MenuItem>  */}
          {/* </Select> */}
        {/* </FormControl> */}

        {/* Render Pie chart for User Levels when "level" is selected */}
        {/* {dataSelected === 'level' && (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
            <Pie
              data={userLevels}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              label={renderCustomLabel}
            >
            {userLevels.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={['#8884d8', '#82ca9d', '#ffc658', '#ff7f50'][index % 4]}
              />
            ))}
          </Pie>
             <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )} */}


        {/* Render Bar chart for Sign Up when "sign" is selected */}
        {/* {dataSelected === 'sign' && (
          <> */}
          <div className='flex m-2'>
            <div className="grid grid-rows-2 gap-1 my-auto">
              <div className=" flex items-center justify-center space-x-2">
                <ResponsiveContainer width="90%" height={300} className='bg-white rounded-lg'>

                  <PieChart>
                  <text x={150} y={20} textAnchor="middle" fontSize={20} fontWeight="bold">
                          ระดับอาการ
                        </text>
                  <Pie
                      data={userLevels}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius="60%"
                      label={renderCustomLabel}
                    >
                      {userLevels.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={['#8884d8', '#82ca9d', '#ffc658', '#ff7f50'][index % 4]}
                        />
                      ))}
                      </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <ResponsiveContainer width="90%" height={300} className='bg-white rounded-lg'>
                        <BarChart data={Object.keys(Agecounted).map((key) => ({ age: key, count: Agecounted[key] }))} margin={{ top: 60, right: 20, left: 20, bottom: 20 }}>
                        <text x={150} y={20} textAnchor="middle" fontSize={20} fontWeight="bold">
                          อายุ
                        </text>
                          <XAxis dataKey="age" tick={{ fill: 'black', fontSize: 14 }} />
                          <YAxis tick={{ fill: 'black', fontSize: 14 }} />
                          <Tooltip contentStyle={{ backgroundColor: '#333', color: '#fff', borderRadius: '8px' }} />
                          <Legend />
                          <Bar dataKey="count" fill="#FF6384">
                            <LabelList dataKey="count" position="top" fill="black" fontSize={14} fontWeight="bold" />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
              </div>
              <div className="bg-white flex flex-col rounded-lg mx-1">
                <text className='text-2xl font-bold'>
                  อัตราการสมัคร
                </text>
                <BarChart className="m-0" width={600} height={150} data={data2}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar type="monotone" dataKey="value" fill="#2196F3">
                    
                    <LabelList
                      dataKey="value"
                      position="top"
                      fill="black"
                      fontSize={14}
                      fontWeight="bold"
                    />
                  </Bar>
                </BarChart>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    className="bg-white rounded-lg m-1"
                    label="ตัวเลือก"
                    value={selectedDate}
                    onChange={(newDate) => handleDateChange(newDate)}
                    views={["year", "month"]}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </div>
            </div>
            <BarChart
  className="bg-white my-auto rounded-lg m-2 "
  width={400}
  height={600}
  data={data3}
  layout="vertical"
  margin={{ top: 60, right: 20, left: 60, bottom: 20 }} // 👈 Adjusted here
>
  {/* Chart title */}
  <text
    x={200}
    y={30} // 👈 Moved down to match new margin
    textAnchor="middle"
    fontSize={20}
    fontWeight="bold"
  >
    ท่าที่นิยมเล่น
  </text>

  <XAxis type="number" />
  <YAxis type="category" dataKey="exercisename" />
  <Tooltip />
  <Legend />
  <Bar dataKey="value" fill="#2196F3">
    <LabelList
      dataKey="value"
      position="right"
      fill="black"
      fontSize={14}
      fontWeight="bold"
    />
  </Bar>
</BarChart>

            </div>
  

          {/* </>
        )} */}

        {/* Render Bar chart for Age when "age" is selected */}
        {/* {dataSelected === 'age' && (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={Object.keys(Agecounted).map((key) => ({ age: key, count: Agecounted[key] }))}>
              <XAxis dataKey="age" tick={{ fill: 'black', fontSize: 14 }} />
              <YAxis tick={{ fill: 'black', fontSize: 14 }} />
              <Tooltip contentStyle={{ backgroundColor: '#333', color: '#fff', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="count" fill="#FF6384">
                <LabelList dataKey="count" position="top" fill="black" fontSize={14} fontWeight="bold" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )} */}

        <div className="sib_of_dash p-2 "
        style={{ backgroundImage: `url('https://${ip}:5173/image/bgim6.png')` }}>
          <h2 className="text-2xl font-bold text-black">รายชื่อผู้ใช้</h2>
          <div className="user_display">
          <div className='flex text-wrap justify-between text-center mx-10 items-center p-2 bg-white rounded-lg'>
                <div className='flex justify-center w-full text-center mx-auto border-x-2'>
                  ชื่อ
                </div>
                <div className='flex justify-center w-full text-center px-auto border-x-2'>
                  อีเมลล์
                </div>
                <div className='flex justify-center w-full text-center mx-auto border-x-2'>
                  วันเกิด
                </div>
                <div className='flex justify-center w-full text-center mx-auto border-x-2'>
                  ตัวเลือก
                </div>
              </div>
            <div className="SSBOXcontainer container">
              {data.map((user) => (
                <div key={user._id} className="grid text-wrap justify-between text-center items-center bg-white my-1 rounded-xl p-2 h-1/6 border-solid border-2 border-black">
                  <div className="w-[100px] md:w-[150px] text-[10px] md:text-[15px]">
                    <p>{user.username}</p>
                  </div>
                  <div className="w-[100px] md:w-[150px] text-[10px] md:text-[15px]">
                    <p>{user.email}</p>
                  </div>
                  <div className="w-[100px] md:w-[150px] text-[10px] md:text-[15px]">
                    <p>{new Date(user.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                  <div className="setBTN">
                    <a href={`https://${ip}:5173/profile/${user._id}`} className="bg-blue-500 p-1 text-[10px] md:text-[15px] rounded-lg text-white">
                      รายละเอียด
                    </a>
                    {/* <button onClick={() => DeleteUser(user._id)} className="bg-red-500 text-[10px] md:text-[15px] p-1 text-white">
                      ลบ
                    </button> */}
                    <button 
                    // onClick={() => DeleteUser(user._id)} 
                    onClick={() => togglePopup(user)}
                    className="bg-red-500 text-[10px] md:text-[15px] p-1 text-white">
                      ลบ
                    </button>
                    {/* <button className="text-black px-6 py-2 rounded-full" onClick={togglePopup}>
                      <div className='md:w-72 w-48 shadow-2xl rounded-full aspect-square overflow-hidden'>
                      </div>
                      
                    </button> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {isPopupOpen && <Popup onClose={togglePopup} UserIdss={UserIdssr} data={Emails}  />}
    </div>
  );
}
const Popup = ({ onClose ,UserIdss,data}) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState('');
  const { ip, setGlobalVariable } = useContext(GlobalContext);
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    
  };

const sendEmail = async (data) => {
  if (!data) {
    console.error('No email provided');
    return;
  }
  let formData = {
    to: data,
    subject: '❌🗑️บัญชีคุณถูกลบออกจาก Bye hunchback',
    text: 'บัญของคุณโดนลบโดยผู้ดูแลระบบของเว็ปไซต์ bye hunchback'
  }
  try {
    const response = await axios.post('https://192.168.1.196:5000/send-email', formData);
    console.log(response.data);
  } catch (error) {
    console.error('Error sending email:', error);
    alert('Failed to send email.');
  }
};


  const DeleteUser = async (id) => {
    try {
      await axios.delete(`https://${ip}:5000/deleteUser/${id}`);
      // Assuming fetchData is defined somewhere or should be removed
      // fetchData();
      await sendEmail(data)
      // window.location.reload(); // Optional refresh
      onClose();

    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

const handleUpload = async () => {
  if (!file) {
    setStatus('Please select a file first');
    return;
  }

  // const formData = new FormData();
  // formData.append('image', file);
  // formData.append('userId', UserIdss);
  // try {
  //   const response = await axios.post(`https://${ip}:5000/upload/`, formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data'
  //     }
  //   });
  //   setStatus(response.data.message);
  //   if (response.status === 200){
  //     window.location.reload();
  //   }
  //   onClose();
  // } catch (error) {
  //   setStatus('Failed to upload image');
  // }
};

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()} // Stop event propagation here
      >
        <h2 className="text-lg font-bold mb-4">ต้องการยืนการการลบหรือไม่??</h2>
        {/* <input type="file" onChange={handleFileChange} />
        {preview && <img src={preview} alt="Preview" className="flex my-4 w-32 h-32 object-cover mx-auto" />} */}
        <div className="space-x-5 mt-5">
          <button onClick={() => DeleteUser(UserIdss)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            ยืนยัน
          </button>
          <button onClick={onClose} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
            ยกเลิก
          </button>
        </div>
        {status && <p className="mt-4 text-red-500">{status}</p>}
      </div>

    </div>
  );
};
export {Dash , Popup};
