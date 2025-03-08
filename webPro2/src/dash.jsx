import React, { useState, useEffect } from 'react';
import './dash.css';
import axios from 'axios';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { BarChart, Bar, LabelList, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, LabelList as PieLabelList } from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, startOfMonth } from 'date-fns';

function Dash() {
  const ip = '192.168.1.196';
  const [data, setData] = useState([]);
  const [data2, setData2] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [Agecounted, setAgecounted] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState('');
  const [userLevels, setUserLevels] = useState([]); // Store user levels data
  const [dataSelected, setdataSelected] = useState('age');

  const handleChange = (event) => {
    setdataSelected(event.target.value);
  };

  // Fetch user levels data
  const fetchUserLevels = async () => {
    try {
      const response = await axios.get(`https://${ip}:5000/latestLevels`);
      
      // Count the occurrences of each level
      const levelCount = response.data.reduce((acc, level) => {
        const levelName = level.latestLevel; // Assuming "latestLevel" is the field for the level name
        acc[levelName] = (acc[levelName] || 0) + 1;
        return acc;
      }, {});
  
      // Convert the level count object into an array of objects
      const levelsData = Object.keys(levelCount).map(levelName => ({
        name: levelName,
        value: levelCount[levelName],
      }));
  
      // Find the level with the highest count
      const mostFrequentLevel = levelsData.reduce((max, current) => {
        return current.value > max.value ? current : max;
      });
  
      console.log("Most Frequent Level:", mostFrequentLevel); // This logs the most frequent level
  
      setUserLevels(levelsData); // Set all levels data
      // Optionally, you can store the most frequent level as well:
      // setMostFrequentLevel(mostFrequentLevel);
  
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
      const response = await axios.get('https://192.168.1.196:5000/userData');
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
      await axios.delete(`https://192.168.1.196:5000/deleteUser/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchUserLevels(); // Fetch user levels data
    fetchUserData(formattedDate);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-black via-purple-950 to-blue-900 animate-gradient-x`}>
      <h1 className="text-7xl text-white font-bold">กระดานข้อมูล</h1>
      <div className="graphBox m-3 rounded-lg mx-auto">
        <FormControl fullWidth className="p-3 mt-3">
          <InputLabel id="demo-simple-select-label">ตัวเลือก</InputLabel>
          <Select
            className="bg-white"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={dataSelected}
            label="Select an Option"
            onChange={handleChange}
          >
            <MenuItem value={'sign'}>อัตราการสมัคร</MenuItem>
            <MenuItem value={'age'}>อายุ</MenuItem>
            <MenuItem value={'level'}>ระดับของผู้ใช้</MenuItem> {/* Added the "level" option */}
          </Select>
        </FormControl>

        {/* Render Pie chart for User Levels when "level" is selected */}
        {dataSelected === 'level' && (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userLevels}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="80%"
                fill="#8884d8"
                label
              >
                <PieLabelList dataKey="name" position="inside" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}

        {/* Render Bar chart for Sign Up when "sign" is selected */}
        {dataSelected === 'sign' && (
          <>
            <BarChart className="m-5 mb-0" width={600} height={300} data={data2}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar type="monotone" dataKey="value" fill="#2196F3">
                <LabelList dataKey="value" position="top" fill="black" fontSize={14} fontWeight="bold" />
              </Bar>
            </BarChart>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                className="bg-white rounded-lg m-1"
                label="ตัวเลือก"
                value={selectedDate}
                onChange={(newDate) => handleDateChange(newDate)}
                views={['year', 'month']}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </>
        )}

        {/* Render Bar chart for Age when "age" is selected */}
        {dataSelected === 'age' && (
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
        )}

        <div className="sib_of_dash p-2">
          <h2 className="text-2xl font-bold text-white">รายชื่อผู้ใช้</h2>
          <div className="user_display">
            <div className="SSBOXcontainer container">
              {data.map((user) => (
                <div key={user._id} className="grid text-wrap justify-between text-center items-center bg-white my-1 rounded-xl p-2 h-1/6">
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
                    <a href={`https://192.168.1.196:5173/profile/${user._id}`} className="bg-blue-500 p-1 text-[10px] md:text-[15px] rounded-lg text-white">
                      รายละเอียด
                    </a>
                    <button onClick={() => DeleteUser(user._id)} className="bg-red-500 text-[10px] md:text-[15px] p-1 text-white">
                      ลบ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dash;
