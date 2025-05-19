import React, { useEffect, useState,useContext  } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ImgNha from './assets/img.svg';
import IRight from './assets/right.svg';
import './exercise.css';
import { GlobalContext } from "./context/GlobalContext";
// const ip = 'https://192.168.1.129'
function Exercise() {
  const { ip } = useContext(GlobalContext);
  
  const [loading, setLoading] = useState(true);
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
    

  return (
    <div
    className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-black via-purple-950 to-blue-900  animate-gradient-x `}
    >
      <h1 className='text-7xl text-white p-3 font-bold'>กายบริหาร</h1>
      <div className='text-blue-600 text-2xl p-2 bg-white rounded-lg m-2 w-[80vw]'>
        การยืดกล้ามเนื้อ → เสริมสร้างกล้ามเนื้อ → พัฒนาเสถียรภาพและควบคุมท่าทาง
      </div>
      <div className=' rounded-lg shadow-lg mb-5'
      style={{ backgroundImage: `url('https://${ip}:5173/image/bfim2.png')` }}>
        <div className='overflow-y-auto h-[480px] p-2 space-y-5 bar' style={{scrollbarWidth: 'none'}}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            exercises.map((exercise) => (
              <ExerciseCard key={exercise._id} exercise={exercise} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
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
    <div className={`flex  bg-cover mx-auto bg-center flex-col md:flex-row justify-between shadow-lg my-2 w-[80vw] space-y-4 border-gray-500 rounded-lg p-2`}
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
        <div className='flex flex-col px-3 items-start'>
          <h3 className='font-bold text-black text-3xl'>{exercise.exercisename}</h3>
          <div className='text-start'>
            <p className='text-[15px] md:text-28px max-w-[800px]'>{exercise.describtion}</p>
          </div>
        </div>
        <div className='flex flex-row m-1 my-auto space-x-5 mt-3'>
          <div className='flex bg-blue-400 text-white md:text-2xl items-center rounded-lg h-10 w-auto space-x-10 px-2'>
            <p>rep</p> <span className='md:text3xl text-green-300'>{exercise.replete}</span>
          </div>
          <div className='flex bg-blue-400 text-white md:text-2xl items-center rounded-lg h-10 w-auto space-x-10 px-2'>
            <span className='md:text-3xl text-green-300'>{exercise.set}</span><p>set</p>
          </div>
        </div>
      </div>
      <div className='my-auto mx-auto'>
        <div className='flex bg-red-500 h-[100px] md:h-[200px] mx-auto mt-1 rounded-lg md:max-w-[50px] max-w-full md:ml-8 md:min-w-32'>
          <button onClick={goToPage}>
            <img className='w-72 h-24' src={IRight} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Exercise;
