// import './history.css'
import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import ImgNha from './assets/img.svg';
import IRight from './assets/right.svg';
import dayjs from 'dayjs';
import './exercise.css';
import {BarChart, Bar, LineChart,LabelList,ResponsiveContainer , Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { GlobalContext } from "./context/GlobalContext";
import { div } from '@tensorflow/tfjs';


function History() {
  const { ip, setGlobalVariable } = useContext(GlobalContext);
  // const ip = '192.168.1.129'
  const [groupedData, setGroupedData] = useState({});
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userid');
useEffect(() => {
  const fetchData = async () => {
    try {
      const historyResponse = await axios.get(`https://${ip}:5000/api/exsersice2/${userId}`);
      console.log("History Response:", historyResponse.data);
      const levelResponse = await axios.get(`https://${ip}:5000/user/${userId}/exercises`);
      console.log("Level Response:", levelResponse.data.analysis);
      const grouped = {};
      const GroupingData = ()=>{
        if (Array.isArray(historyResponse.data)) {
          historyResponse.data.forEach((historyItem) => {
            const date = dayjs(historyItem.createdAt).format('YYYY-MM-DD');
            if (!grouped[date]) grouped[date] = { exercises: [], levels: [] };
            grouped[date].exercises.push(historyItem);
          });
        } else {
          console.warn("Expected history data to be an array, but got:", historyResponse.data);
        }
        if (levelResponse.data &&Array.isArray(levelResponse.data?.analysis)) {
          levelResponse.data.analysis.forEach((levelItem) => {
            const date = dayjs(levelItem.createdAt).format('YYYY-MM-DD');
            if (!grouped[date]) grouped[date] = { exercises: [], levels: [] };
            grouped[date].levels.push(levelItem);
          });
            Object.keys(grouped).forEach((date) => {
              if (grouped[date].levels.length > 0) {
                grouped[date].levels.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                grouped[date].levels = [grouped[date].levels[0]];
              }
            });
          } else {
            console.warn("Expected level data to be an array:", levelResponse.data.analysis);
          }
        }
        GroupingData()
        setGroupedData(grouped);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); 
    }
  };

  fetchData();
}, [userId]);

return (
  <div
  className={`min-h-screen  bg-gradient-to-r from-black via-indigo-500 to-blue-900  animate-gradient-x `}
  >
    {/* <h1 className="text-3xl md:text-7xl text-white font-bold p-3">ประวัติการใช้งาน</h1> */}
    <div className='pt-10'>

      <div className=" w-[90vw]  mx-auto p-5 overflow-y-auto  rounded-lg h-[480px]" style={{scrollbarWidth: 'none'}}>
      {loading ? (
        <p>กำลังโลหด...</p>
      ) : (
        Object.keys(groupedData)
          .sort((a, b) => new Date(b) - new Date(a))
          .map((date) => (
            <span key={date} className=" rounded-lg">
              <div className="py-0">
                
                {groupedData[date].exercises.map((exercise) => (
                  <>
                  {/* <div>
                    {exercise.createdAt}
                  </div> */}
                    <CombinedCard 
                      key={exercise._id} 
                      exercise={exercise} 
                      level={groupedData[date].levels?.[0] || null}
                      // Recx={Rec}
                    />
                  </>
                )
                )
                }
              </div>
            </span>
          ))
      )}
      </div>
    </div>
  </div>
);
};
const CombinedCard = ({ exercise, level }) => {
  const { ip } = useContext(GlobalContext);
  const bgImage = `bg-[url('https://${ip}:5173/image/bgim.png')]`;
  // let level;
  // if (item.AnalyzeLevel >= 4) {
  //   level = "รุนแรง";
  // } else if (item.AnalyzeLevel === 3) {
  //   level = "ค่อนแย่";
  // } else if (item.AnalyzeLevel === 2) {
  //   level = "ค่อนดี";
  // } else {
  //   level = "ปกติ";
  // }
let Rec;
// console.log(level.AnalyzeLevel)
if (level){
  if (level.AnalyzeLevel >= 4) {
    Rec = "ยืดกล้ามเนื้อ"
  } else if (level.AnalyzeLevel >= 2 &&  level.AnalyzeLevel < 4) {
    Rec = "สร้างความแข็งแรงให้กล้ามเนื้อ";
  } else if (level.AnalyzeLevel > 1 &&  level.AnalyzeLevel < 2) {
    Rec = "ปรับท่าทางให้เหมาะสม";
  } else if (level.AnalyzeLevel <= 1)  {
    Rec = "รักษาสภาพ";
  } else {
    Rec = "gg";
  }
}else{
  Rec = 'can process'
}
  return (
    <div>
      {/* <div>
        {exercise.createdAt}
      </div> */}
      <div className={`flex bg-cover bg-center mb-2 shadow-lg rounded-lg justify-between items-center min-h-[120px] p-2 md:px-0 mx-auto w-[70vw]`}
      style={{ backgroundImage: `url('https://${ip}:5173/image/bgim4.png')` }}>
          <div className="flex flex-col mx-auto ">
            <h3 className="font-bold text-[20px] text-black md:text-3xl">
              <span className='font-bold text-blue-500 text-[15px] md:text-[20px]'>ท่า </span>
              <span className='text-[15px]'>{exercise.exercisename}</span>
            </h3>
            <p className="text-[20px] md:text-2xl mx-auto text-black">
              <span className='text-[15px]  md:text-[20px] text-blue-500'>
                ในวันที่
              </span> 
              <span className='text-[15px]'>
                {dayjs(exercise.createdAt).format('YYYY-MM-DD')}
              </span>
            </p>
            
          </div>
          {level ? (
            <div className=" flex mx-auto space-x-2">
              <div className=" flex flex-col mx-auto">
                <h3 className="font-bold text-blue-500 text-[15px] md:text-[20px]">ระดับ <span className="text-xl text-black">{level.AnalyzeLevel?? "No level data available"}</span></h3>
                
                <p className="text-[105x] md:text-[20px] text-blue-500 ">ควร <span className='text-black'>{Rec}</span>
                </p>
                <p className="text-[105x] md:text-[20px] text-blue-500 ">ในวันที่ <span className='text-black'>
                    {dayjs(level.createdAt).format('YYYY-MM-DD')}
                  </span>
                </p>
              </div>
              {/* <button>
                <div className='flex items-center justify-end mr-5 bg-blue-300 h-[90px] px-[10px] rounded-lg text-2xl'>
                  คำแนะนำ
                </div>
              </button> */}
            </div>
          ) : (
            <div className="flex flex-col mx-auto">
              <p className="font-bold text-red-500 text-[20px] md:text-2xl ">ไม่มีการวิเคราะห์</p>
            </div>
          )}

      </div>
    </div>
  );
};
export default History;