// import React from 'react'
import axios from 'axios';
import React, { useState,useEffect,useContext,useRef  } from 'react';
import { FormControl,InputLabel,Input,FormHelperText,TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import Papa from "papaparse";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { ConstructionOutlined } from '@mui/icons-material';
import { GlobalContext } from "./context/GlobalContext";

// import { AuthContext } from './AuthContext';
// const os = require('os');
// const getLocalIP() {
//   const interfaces = os.networkInterfaces();
//   for (let iface in interfaces) {
//     for (let i = 0; i < interfaces[iface].length; i++) {
//       let address = interfaces[iface][i];
//       if (address.family === 'IPv4' && !address.internal) {
//         return address.address;
//       }
//     }
//   }
//   return '127.0.0.1';
// }
// const localIP = getLocalIP();

// const [ip, setIP] = useState('');

// useEffect(() => {
//   fetch('/api/ip')
//     .then(response => response.json())
//     .then(data => {
//       setIP(data.ip);
//     })
//     .catch(error => console.error('Error fetching IP:', error));
// }, []);
// import { IPContext } from './IPContext.jsx';
const host = window.location.hostname; // This gets the hostname (e.g., 'localhost' or '172.21.32.1')
const port = 5000; // Fallback to port 5000 if not specified
// const HostIP = 'https://8026-2405-9800-bcb1-8817-fca2-a283-7eb9-3b8e.ngrok-free.app/'
// const HostIP = import.meta.env.VITE_API_URL
const HostIP = `https://192.168.1.196:5000`
// const HostIP = `https://${ip}:5000`
// const ip = "https://192.168.1.129:5000";
// Create an Axios instance with the dynamic base URL
const axiosInstance = axios.create({
  baseURL: `${HostIP}:${port}`, // Construct the URL dynamically
});
const Test = () =>{
  const { ip, setGlobalVariable } = useContext(GlobalContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);
  // const ip = useContext( IPContext );
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const response = await axiosInstance.post('/login', {
        username, // Use state values
        password,
      });
      console.log(response.data); // Handle successful login (token)
      setToken(response.data.token); // Store the token in state
    } catch (error) {
      console.error('Error logging in user:', error);
    }
  };

  return (
    <div className='bg-white min-h-screen'>
      <div className='flex bg-gray-400 min-h-screen justify-center'>
        <div className='my-auto'>
          <form onSubmit={handleLogin}>
            <FormControl className='bg-white rounded-lg px-3 mt-2 my-auto'>
              <h1 className='text-4xl my-2'>Login</h1>
              <TextField
                className='m-2'
                id="outlined-username-input"
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off" // No need for current-password here
              />
              <TextField
                className='m-2'
                id="outlined-password-input"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <FormHelperText className='text-end' id="my-helper-text">
                <span>If you don't have an account </span>
                <a className='text-blue-300' href="/test-sign">Signup</a>
              </FormHelperText>
              <button type='submit' className='bg-blue-400 rounded-lg h-8 w-6/12 mx-auto my-3'>
                <p className='text-white font-bold'>Submit</p>
              </button>
            </FormControl>
          </form>
          {token && <h2>Logged in with token: {token}</h2>}
        </div>
      </div>
    </div>
  );
}
const Test_sign = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);
  const handleRegister = async (g) => {
    g.preventDefault();
    try {
        const res = await axiosInstance.post(`/register`, { username, password });
        alert(res.data.message);
    } catch (err) {
        console.error(err.response.data.message);
    }
};
  return (
    <div className='bg-white min-h-screen'>
        <div className='flex bg-gray-400 min-h-screen justify-center'>
          <div className='my-auto'>
            <form onSubmit={handleRegister}>
              <FormControl className='bg-white rounded-lg px-3 mt-2 my-auto' >
                  <h1 className='text-4xl my-2'>
                    Signup
                  </h1>
                  <TextField
                  className='m-2'
                  id="Sign-password-input"
                  label="username"
                  type="text"
                  value={username}
                  onChange={(g) => setUsername(g.target.value)}
                  autoComplete="current-password"
                  />
                  <TextField
                  className='m-2'
                  id="Sign-password-input"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(g) => setPassword(g.target.value)}
                  autoComplete="current-password"
                  />
                  <FormHelperText className='text-end' id="my-helper-text"><span>if you don't have an account </span><a className='text-blue-300' href="/test">Login</a></FormHelperText>
                  <button className='bg-blue-400 rounded-lg h-8 w-6/12 mx-auto my-3'>
                    <p className='text-white font-bold'>Submit</p>
                  </button>
              </FormControl>
            </form>
            {token && <h2>Logged in with token: {token}</h2>}
          </div>
        </div>
    </div>
  )
}

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]); // Store the selected file in state
  };
  
  // const ip = useContext( IPContext );
  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   const formData = new FormData();
  //   formData.append('username', username);
  //   formData.append('password', password);
  //   formData.append('image', image);

  //   try {
  //     const res = await axiosInstance.post(`/register`, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  //     alert(res.data.message);
  //   } catch (err) {
  //     console.error('Error in handleSubmit:', err.response ? err.response.data : err.message);
  //   }
  // };
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submitting:", { username, password }); // Debugging output

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('image', image);

    try {
        const res = await axiosInstance.post(`/register`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        alert(res.data.message);
    } catch (err) {
        if (err.response && err.response.data) {
            console.error('Error in handleSubmit:', err.response.data);
            const errorMessages = err.response.data.errors || [];
            errorMessages.forEach(error => {
                alert(`${error.path}: ${error.msg}`);
            });
        } else {
            console.error('Error in handleSubmit:', err.message);
        }
    }
};
const semM = (e) => {
  console.log('test')
}

  return (
    <form onSubmit={handleSubmit} className='min-h-screen'>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <input
        type="file"
        onChange={handleImageChange}
        accept="image/*"
        required
      />
      <button onClick={semM} type="submit">Register</button>
    </form>
  );
}

function UserProfile ({ userId }) {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  // const host = window.location.hostname;
  // const port = window.location.port || 5000;
  // const axiosInstance = axios.create({
  //   baseURL: `https://${host}:${port}`,
  // });
  useEffect(() => {
      const fetchUserData = async () => {
          try {
              console.log(userId)
              const token = localStorage.getItem('token');
              const response = await axiosInstance.get(`/profile/${userId}`, {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              });
              setUserData(response.data);
          } catch (err) {
              setError('Error fetching user data');
              console.error(err);
          }
      };

      fetchUserData();
  }, []);

  if (error) return <div>{error}</div>;

  return (
      <div className='min-h-screen'>
          {userData ? (
              <div>
                  <h2>User Profile</h2>
                  <p>Username: {userData.username}</p>
                  {/* Only use the filename for image URL */}
                  <p>Image URL: {`/${userData.image}`}</p>
                  
                  {userData.image && (
                      <img 
                          src={`/${userData.image}`} 
                          alt="Profile" 
                          style={{ width: '150px', height: '150px' }} 
                      />
                  )}
              </div>
          ) : (
              <p>Loading...</p>
          )}
      </div>
  );
}

const ParentComponent = () => {
  const [user, setUser] = useState(null);
  // const ip = useContext( IPContext );
  useEffect(() => {
    // Simulate API call
    async function fetchUserData() {
      const res = await axiosInstance.get('/api/user/66f727ec0c97722b1253f227');  // Example API call
      setUser(res.data);
    }
    fetchUserData();
  }, []);

  return (
    <div>
      {user ? <UserProfile user={user} /> : <p>Loading...</p>}
    </div>
  );
}
const LoginTest= () => {
  // const host = window.location.hostname; 
  // const port =  5000;
  // const axiosInstance = axios.create({
  //   baseURL: `https://${host}:${port}`,
  // });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  // const ip = useContext( IPContext );
  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axiosInstance.post(`/login`, {
        username,
        password,
      });
  
      const { token, user } = response.data; // Adjust based on your API response
      localStorage.setItem('token', token); // Save the token if needed
      console.log(token)
      navigate(`/pro/${user.id}`); // Redirect to user profile page
    } catch (error) {
      console.error('Error logging in user:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className='min-h-screen'>
      <form onSubmit={handleLogin}>
        <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
        />
        <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        />
        <button type="submit">Login</button>
      </form>
    </div>
      );
    }
    const LoginPage = () => {
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const [Udata,setUData] = useState('')
      const [Uimg,setUimg]= useState('https://i.kym-cdn.com/entries/icons/original/000/000/226/gendoposecover.jpg')
      const navigate = useNavigate(); // Updated hook
  // const ip = useContext( IPContext );
  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post('/login', {
        username,
        password,
      });

      const { token } = response.data; // Destructure token from the response

      if (token) {
        localStorage.setItem('token', token); // Save token
        // navigate('/'); // Use navigate to redirect
        // console.log(response)
        console.log(response.data.user.img_url)
        setUData(response.data.user.username)
        setUimg(response.data.user.img_url)
      }
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className='min-h-screen'>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
      <p>{`./nodeBack/uploads/${Uimg}`}</p>
      <img src={`${Uimg}`} alt="" />

      <div>
        {Udata}
      </div>
    </div>
  );
};


const YoloComponent = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null); // To hold the media stream

  useEffect(() => {
      const startVideo = async () => {
          try {
              const stream = await navigator.mediaDevices.getUserMedia({ video: true });
              streamRef.current = stream; // Store the stream
              if (videoRef.current) {
                  videoRef.current.srcObject = stream;
              }
          } catch (error) {
              console.error('Error accessing the camera', error);
          }
      };

      startVideo();

      return () => {
          // Cleanup the video stream when the component unmounts
          if (streamRef.current) {
              const tracks = streamRef.current.getTracks();
              tracks.forEach(track => track.stop());
          }
      };
  }, []);

  return (
      <div>
          <h1>Camera Feed</h1>
          <video ref={videoRef} autoPlay style={{ width: '100%', height: 'auto' }} />
      </div>
  );
};

const Popup = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <h2 className="text-lg font-bold mb-4">Popup</h2>
        <p className="mb-4">{message}</p>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};
const UpData = () => {
  const { ip, setGlobalVariable } = useContext(GlobalContext);
  const [exerciseName, setExerciseName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [repeats, setRepeats] = useState('');
  const [sets, setSets] = useState('');
  const [modelUrl, setModelUrl] = useState('');

  const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
          setImage(file);
          console.log(image)
      }
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('exerciseName', exerciseName);
      formData.append('description', description);
      formData.append('image', image)
      formData.append('repeats', repeats);
      formData.append('sets', sets);
      formData.append('modelUrl', modelUrl);

      try {
          const response = await axios.post(`https://${ip}:5000/api/exercises`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
          });
          console.log('Data submitted successfully:', response.data);
      } catch (error) {
          console.error('Error submitting data:', error);
      }
  };

  return (
      <div className="h-screen flex items-center justify-center">
          <form onSubmit={handleSubmit} className='flex flex-col mx-32 bg-red-500 border-r-2 space-y-2'>
              <p>Exercise Name</p>
              <input 
                  type="text" 
                  className='bg-white text-black p-2' 
                  value={exerciseName} 
                  onChange={(e) => setExerciseName(e.target.value)} 
              />
              
              <p>Description</p>
              <input 
                  type="text" 
                  className='bg-white text-black p-2' 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
              />
              
              <p>Image</p>
              <input 
                  type="file" 
                  className='bg-white text-black p-2' 
                  onChange={handleFileChange} 
              />
              
              <p>Repeats</p>
              <input 
                  type="number" 
                  className='bg-white text-black p-2' 
                  value={repeats} 
                  onChange={(e) => setRepeats(e.target.value)} 
              />
              
              <p>Sets</p>
              <input 
                  type="number" 
                  className='bg-white text-black p-2' 
                  value={sets} 
                  onChange={(e) => setSets(e.target.value)} 
              />
              
              <p>Model URL</p>
              <input 
                  type="text" 
                  className='bg-white text-black p-2' 
                  value={modelUrl} 
                  onChange={(e) => setModelUrl(e.target.value)} 
              />
              
              <button type="submit" className='bg-blue-500 text-white p-2 mt-4'>Submit</button>
          </form>
      </div>
  );
};


const VideoFrameExtractor = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [videoFile, setVideoFile] = useState(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [keypointsData, setKeypointsData] = useState([]);
  const [poseModel, setPoseModel] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureInterval, setCaptureInterval] = useState(null);

  useEffect(() => {
    const loadModel = async () => {
      await tf.setBackend("webgl");
      await tf.ready();
      const model = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
      );
      setPoseModel(model);
      console.log("MoveNet model loaded successfully");
    };
    loadModel();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      setVideoFile(videoURL);
      setCapturedImages([]);
      setKeypointsData([]);
    }
  };

  const captureFrame = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !poseModel) return;
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
    const imageData = canvas.toDataURL("image/png");
  
    // Perform pose estimation
    const poses = await poseModel.estimatePoses(video);
  
    // Draw keypoints
    drawKeypoints(ctx, poses);
  
    // Use functional state updates to get the correct frame number
    setCapturedImages((prevImages) => {
      const newImages = [...prevImages, imageData]; // Update images
      const frameNumber = newImages.length; // Correct frame number after adding the new image
  
      // Update keypoints data using the correct frame number
      setKeypointsData((prevData) => [
        ...prevData,
        formatKeypointsForCSV(poses, frameNumber),
      ]);
  
      return newImages; // Return updated images array
    });
  };
  

  const startAutoCapture = () => {
    if (isCapturing || !videoRef.current) return;

    setIsCapturing(true);
    const interval = setInterval(captureFrame, 1000); // Capture a frame every 1 second
    setCaptureInterval(interval);
  };

  const stopAutoCapture = () => {
    if (captureInterval) {
      clearInterval(captureInterval);
      setCaptureInterval(null);
      setIsCapturing(false);
    }
  };

  const drawKeypoints = (ctx, poses) => {
    poses.forEach((pose) => {
      pose.keypoints.forEach((keypoint) => {
        if (keypoint.score > 0.5) {
          ctx.beginPath();
          ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = "red";
          ctx.fill();
        }
      });
    });
  };

  // Convert keypoints to CSV row format
  const formatKeypointsForCSV = (poses, frameNumber) => {
    let csvRows = [];
    poses.forEach((pose) => {
      pose.keypoints.forEach((keypoint) => {
        csvRows.push(`${frameNumber},${keypoint.name},${keypoint.x},${keypoint.y},${keypoint.score}`);
      });
    });
    return csvRows.join("\n");
  };

  const downloadAllData = async () => {
    if (capturedImages.length === 0) return;

    const zip = new JSZip();

    // Save images
    capturedImages.forEach((image, index) => {
      const imgData = image.replace(/^data:image\/png;base64,/, "");
      zip.file(`frame-${index + 1}.png`, imgData, { base64: true });
    });

    // Save keypoints CSV
    const csvHeader = "Frame,Keypoint,X,Y,Confidence\n";
    const csvContent = csvHeader + keypointsData.join("\n");
    zip.file("keypoints.csv", csvContent);

    // Generate and save ZIP file
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "pose-data.zip");
  };

  return (
    <div className="p-4">
      <input type="file" accept="video/*" onChange={handleFileChange} className="mb-4" />

      {videoFile && (
        <div>
          <video ref={videoRef} controls width="640" height="360">
            <source src={videoFile} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <button
            className={`mt-4 p-2 bg-blue-500 text-white rounded ${isCapturing ? 'bg-red-500' : ''}`}
            onClick={isCapturing ? stopAutoCapture : startAutoCapture}
          >
            {isCapturing ? "Stop Auto Capture" : "Start Auto Capture"}
          </button>

          {capturedImages.length > 0 && (
            <button className="ml-4 p-2 bg-yellow-500 text-white rounded" onClick={downloadAllData}>
              Download ZIP (Images + Keypoints CSV)
            </button>
          )}
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      {capturedImages.length > 0 && (
        <div className="mt-4">
          <h3>Captured Frames:</h3>
          <div className="grid grid-cols-2 gap-4">
            {capturedImages.map((img, index) => (
              <div key={index}>
                <img src={img} alt={`Frame ${index}`} className="border rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
const PoseModel = () => {
  const [model, setModel] = useState(null);
  const [data, setData] = useState([]);
  const [prediction, setPrediction] = useState(null);

  const normalizeData = (rawData, imageWidth = 1280, imageHeight = 720) => {
    return rawData.map((row) => {
      const x = parseFloat(row.X) / imageWidth; // Normalize X to [0, 1]
      const y = parseFloat(row.Y) / imageHeight; // Normalize Y to [0, 1]
      const confidence = parseFloat(row.Confidence); // Use confidence as is
      const target = parseInt(row.target, 10); // Target value
  
      // Ensure no NaN values
      return {
        x: isNaN(x) ? 0 : x,
        y: isNaN(y) ? 0 : y,
        confidence: isNaN(confidence) ? 0 : confidence,
        target: isNaN(target) ? 0 : target,
      };
    });
  };

  const flattenPoseData = (rawData) => {
    const keypoints = [
      'nose', 'left_eye', 'right_eye', 'left_ear', 'right_ear',
      'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow',
      'left_wrist', 'right_wrist', 'left_hip', 'right_hip', 'left_knee',
      'right_knee', 'left_ankle', 'right_ankle'
    ];
  
    return rawData.map((row) => {
      let flatData = [];
      
      keypoints.forEach((keypoint) => {
        const kpData = rawData.find((data) => data.keypoint === keypoint);
        if (kpData) {
          flatData.push(parseFloat(kpData.X) / 640); // Normalize X
          flatData.push(parseFloat(kpData.Y) / 480);  // Normalize Y
          flatData.push(parseFloat(kpData.Confidence)); // Confidence
        }
      });
  
      return flatData;
    });
  };
  

  // 🔹 Handle CSV Upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const formattedData = normalizeData(result.data); // Adjust as needed
        console.log("Formatted Data:", formattedData);
        setData(formattedData);
      },
    });
  };

  // 🔹 Create Model
  const createModel = async () => {
    await tf.ready();

    const newModel = tf.sequential();
    newModel.add(tf.layers.dense({ units: 16, activation: "relu", inputShape: [54] })); // Adjust input shape for flattened data
    newModel.add(tf.layers.dense({ units: 8, activation: "relu" }));
    newModel.add(tf.layers.dense({ units: 1, activation: "sigmoid" })); // Use sigmoid for binary classification

    newModel.compile({
      optimizer: tf.train.adam(),
      loss: "binaryCrossentropy", // 🔥 For binary classification
      metrics: ["accuracy"],
    });

    setModel(newModel);
    console.log("✅ Model created:", newModel.summary());
  };

  const trainModel = async () => {
    if (!model || data.length === 0) {
      alert("Upload CSV and create model first!");
      return;
    }
  
    try {
      const xs = tf.tensor2d(
        data.map((d) => [
          d.x1, d.y1, d.confidence1, 
          d.x2, d.y2, d.confidence2,
          d.x3, d.y3, d.confidence3,
          d.x4, d.y4, d.confidence4,
          d.x5, d.y5, d.confidence5,
          d.x6, d.y6, d.confidence6,
          d.x7, d.y7, d.confidence7,
          d.x8, d.y8, d.confidence8,
          d.x9, d.y9, d.confidence9,
          d.x10, d.y10, d.confidence10,
          d.x11, d.y11, d.confidence11,
          d.x12, d.y12, d.confidence12,
          d.x13, d.y13, d.confidence13,
          d.x14, d.y14, d.confidence14,
          d.x15, d.y15, d.confidence15,
          d.x16, d.y16, d.confidence16,
          d.x17, d.y17, d.confidence17,
          d.x18, d.y18, d.confidence18
        ])
      );
  
      const ys = tf.tensor2d(data.map((d) => [d.target])); // Assuming target is the label for classification
  
      console.log("Input Shape (xs):", xs.shape);
      console.log("Target Shape (ys):", ys.shape);
  
      await model.fit(xs, ys, {
        epochs: 20,
        batchSize: 4,
        callbacks: {
          onEpochEnd: (epoch, logs) => console.log(`Epoch ${epoch + 1}: Loss = ${logs.loss}`),
        },
      });
  
      alert("Model training complete!");
    } catch (error) {
      console.error("Error during training:", error);
    }
  };
  

  const makePrediction = async () => {
    if (!model || data.length === 0) {
      alert("Upload CSV and train the model first!");
      return;
    }

    // Use the first row of data for prediction (or use other rows as needed)
    const input = tf.tensor2d([data[0]]);  // Adjust as needed for correct input format

    // Make prediction
    const output = model.predict(input);
  
    // Get the prediction result
    const predictionData = await output.data();
    const probability = predictionData[0]; // The predicted probability for class 1
  
    // Classify as 0 or 1 based on the threshold (e.g., 0.5)
    const predictedClass = probability >= 0.5 ? 1 : 0;
  
    setPrediction(predictedClass);
  
    console.log("🔹 Prediction Probability:", probability);
    console.log("🔹 Predicted Class:", predictedClass);
  };

  return (
    <div className="p-5 space-y-4">
      <h2 className="text-xl font-bold">Pose Estimation Model</h2>

      <input type="file" accept=".csv" onChange={handleFileUpload} className="mb-2 border p-2" />

      <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={createModel}>
        Create Model
      </button>

      <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={trainModel}>
        Train Model
      </button>

      <button className="px-4 py-2 bg-purple-500 text-white rounded" onClick={makePrediction}>
        Make Prediction
      </button>

      {prediction !== null && (
        <p className="text-lg font-semibold">Prediction: {prediction.toFixed(4)}</p>
      )}
    </div>
  );
};

const PoseDataTransformer = () => {
  const [rawData, setRawData] = useState([]);
  const [transformedData, setTransformedData] = useState([]);

  // Function to handle file input and parse CSV
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const data = result.data;
          setRawData(data);
          const transformed = transformData(data);
          setTransformedData(transformed);
        },
        header: true,  // Treat first row as headers
      });
    }
  };

  // Function to transform data
  const transformData = (data) => {
    const transformed = data.reduce((acc, { Frame, Keypoint, X, Y }) => {
      if (!acc[Frame]) acc[Frame] = { Frame };
      acc[Frame][`${Keypoint}X`] = X;
      acc[Frame][`${Keypoint}Y`] = Y;
      return acc;
    }, {});

    return Object.values(transformed);
  };

  // Function to convert data to CSV format
  const convertToCSV = (data) => {
    if (!data.length) return "";

    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) => Object.values(row).join(","));
    
    return [headers, ...rows].join("\n");
  };

  // Function to trigger CSV file download
  const downloadCSV = (data) => {
    const csvData = convertToCSV(data);
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "output.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Pose Data Transformer</h2>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mb-4"
      />

      <button
        onClick={() => downloadCSV(transformedData)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
        disabled={!transformedData.length}
      >
        Download CSV
      </button>

      <table className="mt-4 border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            {transformedData.length > 0 &&
              Object.keys(transformedData[0]).map((header) => (
                <th key={header} className="border border-gray-300 px-2 py-1">
                  {header}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {transformedData.map((row, index) => (
            <tr key={index} className="border border-gray-300">
              {Object.values(row).map((value, i) => (
                <td key={i} className="border border-gray-300 px-2 py-1">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

class DecisionTreeClassifier {
  constructor(maxDepth = 10) {
    this.maxDepth = maxDepth;
  }

  // Function to calculate the entropy of labels
  entropy(labels) {
    if (!Array.isArray(labels) || labels.length === 0) {
      return 0;
    }

    const labelCounts = {};
    labels.forEach(label => {
      labelCounts[label] = (labelCounts[label] || 0) + 1;
    });

    const total = labels.length;
    return Object.values(labelCounts).reduce((entropy, count) => {
      const prob = count / total;
      return entropy - prob * Math.log2(prob);
    }, 0);
  }

  // Function to build the tree
  buildTree(data, labels, depth = 0) {
    // Log labels to debug
    console.log('Building tree, labels:', labels);

    if (!Array.isArray(labels) || labels.length === 0 || depth >= this.maxDepth || new Set(labels).size === 1) {
      const majorityLabel = labels.reduce((a, b, _, arr) => {
        return arr.filter(v => v === a).length > arr.filter(v => v === b).length ? a : b;
      });
      return { label: majorityLabel };
    }

    const bestFeature = this.bestSplit(data, labels);
    const tree = { featureIndex: bestFeature, branches: {} };

    const featureValues = [...new Set(data.map(row => row[bestFeature]))];
    featureValues.forEach(value => {
      const subsetData = data.filter((row, i) => row[bestFeature] === value);
      const subsetLabels = labels.filter((_, i) => data[i][bestFeature] === value);
      tree.branches[value] = this.buildTree(subsetData, subsetLabels, depth + 1);
    });

    return tree;
  }

  // Function to train the classifier
  train(trainingData) {
    const xs = trainingData.xs;
    const ys = trainingData.ys;

    // Ensure ys is an array before calling buildTree
    if (!Array.isArray(ys)) {
      console.error('Expected ys to be an array:', ys);
      return;
    }

    this.tree = this.buildTree(xs, ys);
  }

  // Placeholder method for splitting the data
  bestSplit(data, labels) {
    // Example: return a random feature index as best split
    return Math.floor(Math.random() * data[0].length);
  }
}

// Example usage:
const classifier = new DecisionTreeClassifier();
classifier.train({
  xs: [[1, 2], [3, 4], [5, 6]],
  ys: [0, 1, 1],
});


const PoseModelTraining = () => {
  const [model, setModel] = useState(null);
  const [trainingData, setTrainingData] = useState({ xs: null, ys: null });

  useEffect(() => {
    const loadCSVData = async () => {
      try {
        // Ensure TensorFlow.js is ready
        await tf.ready();
  
        // Load the CSV file
        const response = await fetch(`https://192.168.1.129:5173/data.csv`); // Path to your CSV file in the public folder
  
        // Check if the file was found
        if (!response.ok) {
          throw new Error(`Failed to fetch CSV file: ${response.status} ${response.statusText}`);
        }
  
        const text = await response.text(); // Move this inside the try block
        // console.log(text)
        // Parse the CSV file
        Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            const data = results.data;
            // data = data.filter(row => row.label !== undefined && row.label !== null);
            // Extract features and labels
            const features = data.map(row => [
              // row.noseX, row.noseY,
              // row.left_eyeX, row.left_eyeY,
              // row.right_eyeX, row.right_eyeY,
              // row.left_earX, row.left_earY,
              // row.right_earX, row.right_earY,
              row.left_shoulderX, row.left_shoulderY,
              row.right_shoulderX, row.right_shoulderY,
              row.left_elbowX, row.left_elbowY,
              row.right_elbowX, row.right_elbowY,
              row.left_wristX, row.left_wristY,
              row.right_wristX, row.right_wristY,
              // row.left_hipX, row.left_hipY,
              // row.right_hipX, row.right_hipY,
              // row.left_kneeX, row.left_kneeY,
              // row.right_kneeX, row.right_kneeY,
              // row.left_ankleX, row.left_ankleY,
              // row.right_ankleX, row.right_ankleY,
            ]);
            // const classCounts = {};
            // data.forEach(row => {
            //   classCounts[row.label] = (classCounts[row.label] || 0) + 1;
            // });
            // console.log("Class Distribution:", classCounts);
            let labels = data.map(row => row.label); 
            const augmentData = (points) =>
              points.map((p) => p + Math.random() * 100 - 5);
            let augmentedFeatures = features.flatMap((row) => [row, augmentData(row)]);
            let augmentedLabels = labels.flatMap((label) => [label, label]);  
            // Assuming 'label' is the target column with values 0 to 4
            // const labels = data.map(row => row.label); // Replace 'label' with your actual label 
            // const ys = tf.oneHot(labels, 5); // 5 classes
            let ys = tf.oneHot(augmentedLabels, 5);
            // Convert data to tensors
            const xs = tf.tensor2d(augmentedFeatures);
        
            // Normalize features to [0, 1]
            const min = xs.min();
            const max = xs.max();
            const normalizedXs = xs.sub(min).div(max.sub(min));
        
            setTrainingData({ xs: normalizedXs, ys });
          },
        });
        
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };
    
    loadCSVData();
  }, []);
  
  useEffect(() => {
    if (trainingData.xs && trainingData.ys) {
      const dt = new DecisionTreeClassifier(5); // Set max depth to 5 (adjust based on your preference)
      dt.train(trainingData.xs, trainingData.ys);
      setModel(dt);
    }
  }, [trainingData]);
  // useEffect(() => {
  //   if (trainingData.xs && trainingData.ys) {
  //     const trainModel = async () => {
  //       // Ensure TensorFlow.js is ready
  //       await tf.ready();

  //       // Define a sequential model
  //       const model = tf.sequential();
  //       // model.add(tf.layers.dense({ units: 5, inputShape: [34], activation: 'relu', kernelInitializer: 'heNormal' }));
  //       // model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
  //       // model.add(tf.layers.dense({ units: 1, activation: 'linear' })); // Assuming regression task
        
  //       model.add(tf.layers.dense({ units: 64, inputShape: [12], activation: 'relu', kernelInitializer: 'heNormal' }));
  //       // model.add(tf.layers.dropout({ rate: 0.3 }));
  //       model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
  //       model.add(tf.layers.dense({ units: 5, activation: 'softmax' })); // Output layer for multi-class classification

  //       // Compile the model with a smaller learning rate
  //       model.compile({ optimizer: tf.train.adam(0.001),
  //          loss: 'categoricalCrossentropy',
  //          metrics: ['accuracy'],
  //          validationSplit: 0.2, 
  //          });
  //       console.log(trainingData.xs, trainingData.ys)
  //       await model.fit(trainingData.xs, trainingData.ys, {
  //         epochs:200,
  //         batchSize:20,

  //         // classWeight: classWeights,
  //         callbacks: {
  //           onEpochEnd: (epoch, logs) => {
  //             console.log(`Epoch ${epoch+1}: loss = ${logs.loss} acc${logs.acc}`);
  //           },
  //         },
  //       });

  //       // Save the model for later use
  //       setModel(model);
  //     };

  //     trainModel();
  //   }
  // }, [trainingData]);

  // const makePrediction = async () => {
  //   if (model) {
  //     // Ensure TensorFlow.js is ready
  //     await tf.ready();

  //     // Example input for prediction (replace with actual data)
  //     const input = tf.tensor2d([[
  //       982.2744799,342.6777792,
  //       970.78756570816,368.547137975692,

  //       838.956102132797,359.606337547302,
  //       849.785832166671,371.972200870513,

  //       719.825402498245,313.912214040756,
  //       758.979420661926,348.700840473175
  //     ]]);

  //     // Normalize the input using the same min/max as training data,
  //     // const min = trainingData.xs.min();
  //     // const max = trainingData.xs.max();
  //     // const normalizedInput = input.sub(min).div(max.sub(min));

  //     const prediction = model.predict(input);
  //     const predictedClassIndex = prediction.argMax(-1).dataSync()[0];
  //     console.log(`Predicted class: ${predictedClassIndex}`);
  //     // prediction.print();
  //     // const predictedClass = Math.round(prediction.dataSync()[0]);
  //     // console.log(predictedClass);
  //   }
  // };
  const makePrediction = () => {
    if (model) {
      // Example input (replace with actual input)
      const input = [
        982.2744799, 342.6777792,
        970.7875657, 368.5471379,
        838.9561021, 359.6063375,
        849.7858321, 371.9722008,
        719.8254024, 313.9122140,
        758.9794207, 348.7008405
      ];

      // Make prediction
      const prediction = model.predict(input);
      console.log(`Predicted class: ${prediction}`);
    }
  };
  return (
    <div>
      <h1>Pose Estimation Model Training</h1>
      <button onClick={makePrediction} disabled={!model}>
        Make Prediction
      </button>
    </div>
  );
};
const CsvReader = () => {
  const [csvData, setCsvData] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (result) => {
        const data = result.data;
        if (data.length > 1) {
          data.forEach((index) => {
              if (index.length > 4) {  // Ensure the row has at least 5 columns
                  console.log(index[4]);
              } else {
                  console.warn(`Row ${index} has less than 5 columns.`);
              }
          });
      } else {
          console.warn("No valid data found.");
      }
      
        if (data.length > 0) {
          // Get column names from the first row
          const columns = data[0];
          setSelectedColumns(columns); // Default to all columns
          // Convert CSV array format into objects
          const formattedData = data.slice(1).map((row) =>
            Object.fromEntries(columns.map((col, index) => [col, row[index]]))
          );
          setCsvData(formattedData);
        }
      },
      header: false, // If the first row contains headers, set this to true
      skipEmptyLines: true,
    });
  };

  const handleColumnSelection = (event) => {
    const { value, checked } = event.target;
    setSelectedColumns((prev) =>
      checked ? [...prev, value] : prev.filter((col) => col !== value)
    );
  };

  return (
    <div className="p-4">
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {csvData.length > 0 && (
        <>
          <h2 className="mt-4 font-bold">Select Columns:</h2>
          <div className="flex gap-2 flex-wrap">
            {Object.keys(csvData[0]).map((column) => (
              <label key={column}>
                <input
                  type="checkbox"
                  value={column}
                  checked={selectedColumns.includes(column)}
                  onChange={handleColumnSelection}
                />{" "}
                {column}
              </label>
            ))}
          </div>

          <table className="border-collapse border border-gray-400 mt-4 w-full">
            <thead>
              <tr>
                {selectedColumns.map((col) => (
                  <th key={col} className="border border-gray-400 p-2">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {csvData.map((row, index) => (
                <tr key={index}>
                  {selectedColumns.map((col) => (
                    <td key={col} className="border border-gray-400 p-2">
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};


// import React, { useState, useEffect } from 'react';
// import * as tf from '@tensorflow/tfjs';
// import Papa from 'papaparse';

const TfjsClassifier = () => {
  const [model, setModel] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [inputData, setInputData] = useState("");

  // 🔹 Load CSV File and Process Data
  const loadData = async (file) => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: (result) => {
                let rawData = result.data.filter(row => Object.values(row).every(val => val !== null));

                // Assuming the keypoints are in the 'keypoints' column
                const labelKey = "Y"; // Label column

                // Extracting only the keypoints
                const features = rawData.map(row => {
                    const keypointsArray = row["keypoints"].split(",").map(Number);
                    if (keypointsArray.length !== 34) {
                        console.error("Unexpected keypoint count:", keypointsArray.length);
                    }
                    return keypointsArray; // Only return keypoints (34 features)
                });

                const labels = rawData.map(row => row[labelKey]);

                resolve({ features, labels });
            },
            error: (err) => reject(err),
        });
    });
};
  // 🔹 Convert Data to Tensors
  const convertToTensors = (features, labels, numClasses) => {
      const featureTensor = tf.tensor2d(features);
      const labelTensor = tf.tensor1d(labels, "int32");
      const oneHotLabels = tf.oneHot(labelTensor, numClasses);
      return { featureTensor, oneHotLabels };
  };

  // 🔹 Define Model
  const createModel = (inputSize, numClasses) => {
      const model = tf.sequential();
      model.add(tf.layers.dense({ inputShape: [inputSize], units: 32, activation: "relu" }));
      // model.add(tf.layers.dense({ units: 16, activation: "relu" }));
      model.add(tf.layers.dense({ units: numClasses, activation: "softmax" }));
      
      model.compile({
          optimizer: tf.train.adam(),
          loss: "categoricalCrossentropy",
          metrics: ["accuracy"],
      });

      return model;
  };

  // 🔹 Train Model
  const trainModel = async (model, featureTensor, oneHotLabels) => {
    const history = await model.fit(featureTensor, oneHotLabels, {
        epochs: 180,
        batchSize: 10,
        validationSplit: 0.2,
        shuffle: true,
    });

    console.log("Training Accuracy:", history.history.acc); // Debugging

    setAccuracy(history.history.acc[history.history.acc.length - 1]);
};

const loadModel = async () => {
  try {
      await tf.ready();
      const loadedModel = await tf.loadLayersModel('localstorage://my-model');
      setModel(loadedModel);
      console.log("Model reloaded successfully.");
  } catch (error) {
      console.error("Error loading model:", error);
  }
};

  // 🔹 Handle File Upload
// In the handleFileUpload function
const handleFileUpload = async (event) => {
  await tf.ready(); // ✅ Ensure TF.js backend is initialized
  await tf.setBackend("webgl"); // ✅ Use WebGL (GPU acceleration)

  const file = event.target.files[0];
  if (!file) return;

  const { features, labels } = await loadData(file);
  const numClasses = Math.max(...labels) + 1;
  const { featureTensor, oneHotLabels } = convertToTensors(features, labels, numClasses);

  const newModel = createModel(features[0].length, numClasses);

  try {
      await trainModel(newModel, featureTensor, oneHotLabels); // Ensure the model is trained
      setModel(newModel); // Save the trained model into state
      await newModel.save('localstorage://my-model'); // Save model to local storage (or use file:// for Node.js)
  } catch (error) {
      console.error("Error during training:", error);
  }
};
const handlePredict = async () => {
  await loadModel(); // Reload the model before making a prediction

  if (!model || !inputData) return;

  const inputArray = inputData.split(",").map(Number);
  console.log(inputArray)
  if (inputArray.length !== 34) {
      console.error("Incorrect input length:", inputArray.length);
      alert(`Invalid input! Expected 34 keypoints, but got ${inputArray.length}.`);
      return;
  }

  tf.tidy(() => {
      const inputTensor = tf.tensor2d([inputArray]);
      console.log("Input Tensor:", inputTensor.arraySync());

      const predictionTensor = model.predict(inputTensor);
      console.log(predictionTensor.argMax(1).dataSync())
      const predictedClass = predictionTensor.argMax(1).dataSync()[0];

      console.log("Predicted Class:", predictedClass);
      setPrediction(predictedClass);
  });
};
useEffect(() => {
  loadModel();
}, [inputData]);
const saveModelToFile = async (model) => {
  await model.save('downloads://my-pretrained-model');
};
const loadPretrainedModel = async () => {
  try {
      const model = await tf.loadLayersModel(`https://192.168.1.194:50173/models/my-pretrained-model.json`);
      setModel(model);
      console.log("Model loaded from public folder.");
  } catch (error) {
      console.error("Error loading model:", error);
  }
};

  return (
      <div className="min-h-[500px] m-10 p-4 max-w-md mx-auto bg-white shadow-lg rounded-lg">
          <h2 className="text-xl font-semibold text-center mb-4">TensorFlow.js Classifier</h2>

          <input type="file" accept=".csv" onChange={handleFileUpload} className="mb-4" />
          {accuracy !== null && <p>Model Accuracy: {accuracy.toFixed(2)}</p>}

          {model && (
              <div className="mt-4">
                  <input
                      type="text"
                      placeholder="Enter comma-separated values"
                      value={inputData}
                      onChange={(e) => setInputData(e.target.value)}
                      className="border p-2 rounded w-full"
                  />
                  <button onClick={loadPretrainedModel} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
                      Load Pretrained Model
                  </button>
                  <button onClick={handlePredict} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
                      Predict
                  </button>
                  <button onClick={() => saveModelToFile(model)} className="mt-2 bg-green-500 text-white px-4 py-2 rounded">
                      Download Model
                  </button>
                  {/* <button
    onClick={() => saveModelToServer(model)}  // Ensure correct model is passed
    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
>
    Save
</button> */}

                  {prediction !== null && <p>Prediction: {prediction}</p>}
              </div>
          )}
      </div>
  );
};
export {CsvReader,TfjsClassifier,UpData,PoseModelTraining,PoseDataTransformer,PoseModel,VideoFrameExtractor,Test,Test_sign,Register,UserProfile,ParentComponent,LoginTest,LoginPage,YoloComponent,Popup}