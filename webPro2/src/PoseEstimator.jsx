import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import { redirect } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Papa from "papaparse";
const PoseEstimatorWithWebcam = () => {
  const userId = localStorage.getItem('userid')
  const navigate = useNavigate()
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const detectorRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const sound = new Audio("./public/ring.mp3");
  const [count, setCount] = useState(0);

  const [model, setModel] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [data0,setdata0] = useState(null);
  const [data1,setdata1] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [Pretenshow, setPretenshow] = useState(null);

  const [RHY, setRHY] = useState();
  const [RHX, setRHX] = useState();
  const [LHY, setLHY] = useState();
  const [LHX, setLHX] = useState();
  const [poseState,setPosstate] = useState('out')
  const poseStateRef = useRef('out');
  // const filePath = "/Mdata/situp.csv";
  // const sound = new Audio("/public/ring.mp3"); // Adjust path if required

  const filePath = "/Mdata/situp.csv"; // Adjust path if required
  const fetchCsvData = async () => {
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const csvText = await response.text();

      Papa.parse(csvText, {
        complete: (result) => {
          console.log("Parsed CSV Data:", result.data);
          setCsvData(result.data);
        },
        header: false,
      });
    } catch (error) {
      console.error("Error reading CSV file:", error);
    }
  };

  const processData = (data) => {
    try {
      const features = data.map((row) =>
        row.slice(0, -2).map((val) => parseFloat(val) || 0)
      );

      const labels = data.map((row) =>
        row.slice(-2).map((val) => parseFloat(val) || 0)
      );

      const xs = tf.tensor2d(features);
      const ys = tf.tensor2d(labels);

      console.log("Processed Features:", features);
      console.log("Processed Labels:", labels);

      return { xs, ys };
    } catch (error) {
      console.error("Error processing data:", error);
      return null; // Ensure it returns null in case of error
    }
  };

  const trainModel = async () => {
    await tf.ready(); // Ensure TensorFlow.js is ready
    tf.setBackend("webgl"); // Explicitly set the backend

    if (!csvData) {
      console.error("No CSV data to train on.");
      return;
    }

    const data = processData(csvData);
    if (!data) {
      console.error("Error processing CSV data.");
      return;
    }

    const { xs, ys } = data;

    setIsTraining(true);

    const model = tf.sequential();
    model.add(
      tf.layers.dense({ units: 64, activation: "relu", inputShape: [xs.shape[1]] })
    );
    model.add(tf.layers.dense({ units: 32, activation: "relu" }));
    model.add(tf.layers.dense({ units: 2 }));

    model.compile({
      loss: "meanSquaredError",
      optimizer: "adam",
    });

    console.log("Training the model...");
    await model.fit(xs, ys, { epochs: 100 });

    console.log("Model trained successfully!");
    setModel(model);

    xs.dispose();
    ys.dispose();
    setIsTraining(false);
  };
  useEffect(() => {
    if (count === 10) {
      const activateFunct = async () => {
        try {
          const res = await axios.post(`https://192.168.1.194:5000/exsersice2/${userId}`, { exercisename: localStorage.getItem('exerciseName'), userId, exerciseId: localStorage.getItem('exerciseId') });
          console.log(res);
          navigate('/history');
        } catch (error) {
          console.error('Error submitting the form:', error);
        }
      };
      activateFunct()
    }
  }, [count]);
  // const predict = (inputTensor) => {
  //   if (!model) {
  //     console.error("Model is not trained yet.");
  //     return;
  //   }
  
  //   // Corrected test input with 34 features
  //   // const testInput = [
  //   //   [
  //   //     70.95541, 17.88984, 68.69504, 15.26721, 68.33548, 15.52587, 59.46544,
  //   //     16.6238, 59.14807, 16.70918, 55.6357, 29.86679, 54.84977, 31.05491,
  //   //     74.25549, 46.34771, 76.24784, 49.50451, 84.97662, 38.94334, 85.97025,
  //   //     38.08085, 25.82169, 56.63424, 20.15937, 57.80789, 62.53997, 54.97769,
  //   //     62.61242, 59.31453, 46.58791, 78.90989, 41.34459, 86.66576,
  //   //   ],
  //   // ];
  
  //   try {
  //     // const inputTensor = tf.tensor2d(testInput);
  
  //     const outputTensor = model.predict(inputTensor);
  //     const outputArray = outputTensor.arraySync();
  
  //     console.log("Prediction Output:", outputArray);
  //     setPrediction(outputArray);
  
  //     inputTensor.dispose();
  //     outputTensor.dispose();
  //   } catch (error) {
  //     console.error("Error during prediction:", error);
  //   }
  // };
  useEffect(() => {
    fetchCsvData();
  }, []);

  useEffect(() => {
    if (csvData) {
      trainModel();
    }
  }, [csvData]);



  let counter = 0;
  let state = {
    leftWrist: 'neutral', // Tracks state for LeftWrist
    rightWrist: 'neutral', // Tracks state for RightWrist
  };
  const tatalas = async () => {

    try {
      const res = await axios.post(`https://192.168.1.194:5000/exsersice2/${userId}`, {exercisename:'SomeExercise2',userId,exerciseId:'67632bab34ae8e47803f2344'});
      console.log(res)
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  }
  // const babu = async ()=>{
  //   if (count >= 4) {
  //     console.log("end");
  //     await tatalas()
  //     navigate('/history')
  //   }
  // }
  // useEffect(() => {
  //   babu()
  // }, [count]);


  // Load MoveNet model
  useEffect(() => {
    const loadModel = async () => {
      try {
        // Wait for TensorFlow.js to be ready
        await tf.ready();
        detectorRef.current = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet
        );
        setIsModelLoaded(true);
        console.log('MoveNet model loaded');
      } catch (error) {
        console.error('Error loading MoveNet model:', error);
      }
    };

    loadModel();
  }, []);

  // Run pose detection on the webcam feed
  useEffect(() => {
    const detectPose = async () => {
      if (!detectorRef.current || !webcamRef.current || !webcamRef.current.video) {
        return;
      }

      const video = webcamRef.current.video;

      // Wait for the video to be ready
      if (video.readyState !== 4) {
        requestAnimationFrame(detectPose);
        return;
      }

      // const videoWidth = video.videoWidth;
      // const videoHeight = video.videoHeight;
      const videoWidth = 1080;
      const videoHeight = 720;

      // Set canvas size to match video size
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const ctx = canvasRef.current.getContext('2d');

      const runDetection = async () => {
        try {
          const poses = await detectorRef.current.estimatePoses(video, {
            maxPoses: 1,
            flipHorizontal: true, // Flip the video horizontally for pose estimation
          });

          drawResults(poses, ctx, videoWidth, videoHeight);
        } catch (error) {
          console.error('Error during pose estimation:', error);
        }

        requestAnimationFrame(runDetection);
      };

      runDetection();
    };

    detectPose();
  }, [isModelLoaded]);
  const playSound = () => {
    sound.play();
  };
  const drawResults = async (poses, ctx, videoWidth, videoHeight) => {
    ctx.clearRect(0, 0, videoWidth, videoHeight);
  
    const keypointNames = [
      "nose", "leftEye", "rightEye", "leftEar", "rightEar",
      "leftShoulder", "rightShoulder", "leftElbow", "rightElbow",
      "leftWrist", "rightWrist", "leftHip", "rightHip",
      "leftKnee", "rightKnee", "leftAnkle", "rightAnkle",
    ];
  
    let predictedClass = "No Action";
  
    for (const pose of poses) {
      const keypoints = pose.keypoints;
  
      if (keypoints.length > 0) {
        let leftEyeY = null;
        keypoints.forEach((keypoint, index) => {
          if (keypoint.score > 0.5 && keypointNames[index] === "leftEyeY") {
            leftEyeY = keypoint.y;

          }
        });
        const features = keypoints.map((keypoint) => {
          if (keypoint.score > 0.5) {

            return [keypoint.x / videoWidth, keypoint.y / videoHeight];
          } else {
            return [0, 0];
          }
        }).flat();
        if (features.length !== 34) {
          console.warn("Invalid input data for prediction");
          continue;
        }
        // console.log("Predicting with input features:", features);
        // let prediction;
        if (model) {
          try {
            const inputTensor = tf.tensor2d([features]);
            // console.log(Pretenshow)
            // console.log("Input Tensor:", inputTensor);
  
            const outputTensor = await model.predict(inputTensor);
            // console.log("Output Tensor:", outputTensor);
            const outputArray = outputTensor.arraySync();
            // const classIndex = outputArray[0][1] > 0.5 ? 1 : 0;
            // predictedClass = classIndex === 1 ? "Action Detected" : "No Action";
            // prediction = classIndex === 1;

            // setPrediction(classIndex);
            const classIndex = outputArray[0][1] > 0.5 ? 1 : 0;
            setdata0(outputArray[0][0])
            setdata1(outputArray[0][1])
            // const classIndex = Math.max(...outputArray );  // Assumingbinary classification
              if (outputArray[0][0] > outputArray[0][1]) {
                predictedClass = "Up";  // Example class name
              } else {
                predictedClass = "Down";  // Example class name
              }
              setPrediction(predictedClass);  // Update the prediction state
              inputTensor.dispose();
              outputTensor.dispose();
          
          } catch (error) {
            console.error("Error during prediction:", error);
            // prediction = false;
          }
        }
  
        // Log the predicted class in the console
        setTimeout(() => {
          // console.log("This message appears after 2 seconds");
          // console.log("Predicted Class:", predictedClass);
        }, 1000);
  
        // Check wrist positions relative to LeftEye
        // keypoints.forEach((keypoint, index) => {
        //   if (keypoint.score > 0.5) {
        //     const partName = keypointNames[index];
        //     const flippedY = keypoint.y; // Use the unflipped Y-coordinate for comparison
  
        //     if ((partName === "leftWrist" || partName === "rightWrist") && leftEyeY !== null) {
        //       const wristState = state[partName]; // Get the current state of the wrist
  
        //       if (flippedY < leftEyeY && wristState !== "above") {
        //         // Wrist moves above the LeftEye
        //         state[partName] = "above";
        //         console.log(`${partName} is now above LeftEye`);
        //       } else if (flippedY > leftEyeY && wristState === "above" && prediction) {
        //         // Wrist moves below the LeftEye after being above and passes prediction
        //         state[partName] = "below";
        //         counter++;
        //         setCount(counter++);
        //         playSound();
        //         console.log(`Count incremented! Current count: ${counter}`);
        //       }
        //     }
  
        //     // Draw keypoint
        //     const flippedX = videoWidth - keypoint.x;
        //     ctx.fillStyle = "red";
        //     ctx.beginPath();
        //     ctx.arc(flippedX, flippedY, 5, 0, 2 * Math.PI);
        //     ctx.fill();
        //   }
        // });

        let localRHX = 0
        let localLHX = 0
        let localRHY = 0
        let localLHY = 0
        let cooldown = false;

        keypoints.forEach((keypoint, index) => {
          if (keypoint.score > 0.5) {
            const partName = keypointNames[index];
        
            if (partName === "leftWrist") {
              localLHY = keypoint.y;
              localLHX = keypoint.x;
            }
        
            if (partName === "rightWrist") {
              localRHY = keypoint.y;
              localRHX = keypoint.x;
        
              if (localLHX !== 0 && localRHX !== 0) {
                const distance = localLHX - localRHX;
                console.log(distance)
                if (!cooldown) {
                  if (distance < 300 && poseStateRef.current === 'out') {
                    setCount((prevCount) => prevCount + 1);
                    setPosstate('in');
                    poseStateRef.current = 'in'; // Update the ref
                    console.log("Changed to 'in'");
                    playSound();
                    cooldown = true;
                    setTimeout(() => (cooldown = false), 50);
                  } else if (distance > 400 && poseStateRef.current === 'in') {
                    setPosstate('out');
                    poseStateRef.current = 'out'; // Update the ref
                    console.log("Changed to 'out'");
                    playSound();
                    cooldown = true;
                    setTimeout(() => (cooldown = false), 50);
                  }
                }
              }
            }
          }
        });
      }
    }
  
    // Update the div with the predicted class
    const predictionDiv = document.getElementById("prediction-text");
    setTimeout(() => {
      if (predictionDiv) {
        predictionDiv.innerText = `Prediction: ${predictedClass}`;
      }
    }, 2000);
  };
  
  


  // const drawResults = (poses, ctx, videoWidth, videoHeight) => {
  //   ctx.clearRect(0, 0, videoWidth, videoHeight);
  
  //   const keypointNames = [
  //     'nose', 'leftEye', 'rightEye', 'leftEar', 'rightEar',
  //     'leftShoulder', 'rightShoulder', 'leftElbow', 'rightElbow',
  //     'leftWrist', 'rightWrist', 'leftHip', 'rightHip',
  //     'leftKnee', 'rightKnee', 'leftAnkle', 'rightAnkle',
  //   ];
  
  //   poses.forEach((pose) => {
  //     const keypoints = pose.keypoints;
  
  //     if (keypoints.length > 0) {
  //       let leftEyeY = null;
  
  //       // Find the Y-coordinate of the LeftEye
  //       keypoints.forEach((keypoint, index) => {
  //         if (keypoint.score > 0.5 && keypointNames[index] === 'leftEye') {
  //           leftEyeY = keypoint.y; // Get the Y-coordinate of LeftEye
  //         }
  //       });
  
  //       // Check wrist positions relative to LeftEye
  //       keypoints.forEach((keypoint, index) => {
  //         if (keypoint.score > 0.5) {
  //           const partName = keypointNames[index];
  //           const flippedY = keypoint.y; // Use the unflipped Y-coordinate for comparison
  
  //           if ((partName === 'leftWrist' || partName === 'rightWrist') && leftEyeY !== null) {
  //             const wristState = state[partName]; // Get the current state of the wrist
  
  //             if (flippedY < leftEyeY && wristState !== 'above') {
  //               // Wrist moves above the LeftEye
  //               state[partName] = 'above';
  //               console.log(`${partName} is now above LeftEye`);
  //             } else if (flippedY > leftEyeY && wristState === 'above') {
  //               // Wrist moves below the LeftEye after being above
  //               state[partName] = 'below';
  //               counter++;
  //               setCount(counter++)
  //               playSound()
  //               console.log(`Count incremented! Current count: ${counter}`);
  //             }
  //           }
  
  //           // Draw keypoint
  //           const flippedX = videoWidth - keypoint.x;
  //           ctx.fillStyle = 'red';
  //           ctx.beginPath();
  //           ctx.arc(flippedX, flippedY, 5, 0, 2 * Math.PI);
  //           ctx.fill();
  //         }
  //       });
  
  //       // Bounding box calculation (unchanged)
  //       let minX = videoWidth, minY = videoHeight, maxX = 0, maxY = 0;
  //       keypoints.forEach((keypoint) => {
  //         if (keypoint.score > 0.5) {
  //           const flippedX = videoWidth - keypoint.x;
  //           const flippedY = keypoint.y;
  
  //           minX = Math.min(minX, flippedX);
  //           minY = Math.min(minY, flippedY);
  //           maxX = Math.max(maxX, flippedX);
  //           maxY = Math.max(maxY, flippedY);
  //         }
  //       });
  
  //       // Draw bounding box
  //       if (maxX > minX && maxY > minY) {
  //         const boxWidth = maxX - minX;
  //         const boxHeight = maxY - minY;
  
  //         ctx.beginPath();
  //         ctx.rect(minX, minY, boxWidth, boxHeight);
  //         ctx.lineWidth = 2;
  //         ctx.strokeStyle = 'green';
  //         ctx.stroke();
  //       }
  //     }
  //   });
  // };

  return (
    <div className="flex flex-col w-full min-h-screen h-full bg-gray-800 items-center justify-center">
      {/* Container for Webcam and Canvas */}
      <div className="w-[100vw] h-[100vh]">
      {/* <div > */}
        <Webcam
          ref={webcamRef}
          className="absolute top-20 left-0 w-full h-full object-cover rounded-lg"
          videoConstraints={{
            width: 1080,
            height: 810,
            facingMode: 'user',
          }}
          mirrored={true} // Flip the video feed for better alignment
        />
        <canvas
          ref={canvasRef}
          // hidden
          className="absolute top-20 left-0 w-full h-full rounded-lg"
        />
      </div>
      <div className='text-white'>
        {poseState}
      </div>
      {/* Loading Overlay */}
      {!isModelLoaded && (
        <div className="absolute mt-[80px] inset-1 h-[720px] bg-black opacity-50">
          <p className="text-white text-5xl">Loading model...</p>
        </div>
      )}
  
      {/* Footer Text */}
      <div className="text-white mt-4">{count}</div>
      <div>
        <button
        // onClick={predict}
        className='text-white'
        >TEst</button>
              {/* {prediction && (

        <div className="mt-4">
          <h3 className="text-lg font-bold">Prediction Result:</h3>
          <p>{JSON.stringify(prediction)}</p>
        </div>
      )} */}
      </div>

      {prediction && (
        <div className="mt-4 text-white">
          <h3 className="text-lg font-bold">Prediction Result:</h3>
          <p className='text-red'>
          Data digit 0: {data0}
          </p>
          <p>{prediction}</p>
          <p className='text-red'>
          Data digit 1: {data1}
          </p>
        </div>
      )}
      <div className='text-white'>
        {Pretenshow}
      </div>
    </div>
  );
  
};

export default PoseEstimatorWithWebcam;



// import React, { useRef, useEffect, useState } from 'react';
// import Webcam from 'react-webcam';
// import * as poseDetection from '@tensorflow-models/pose-detection';
// import * as tf from '@tensorflow/tfjs';
// import { redirect } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const PoseEstimatorWithWebcam = () => {
//   const userId = localStorage.getItem('userid');
//   const navigate = useNavigate();
//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);
//   const detectorRef = useRef(null);
//   const [isModelLoaded, setIsModelLoaded] = useState(false);
//   const sound = new Audio("./public/ring.mp3");
//   const [count, setCount] = useState(0);
//   let counter = 0;
//   let state = {
//     leftWrist: 'neutral', // Tracks state for LeftWrist
//     rightWrist: 'neutral', // Tracks state for RightWrist
//   };
  
//   const tatalas = async () => {
//     try {
//       const res = await axios.post(`https://192.168.1.194:5000/exsersice2/${userId}`, {exercisename: 'SomeExercise2', userId, exerciseId: '67632bab34ae8e47803f2344'});
//       console.log(res);
//     } catch (error) {
//       console.error('Error submitting the form:', error);
//     }
//   };

//   const babu = async () => {
//     if (count >= 4) {
//       console.log("end");
//       await tatalas();
//       navigate('/history');
//     }
//   };

//   useEffect(() => {
//     babu();
//   }, [count]);

//   // Load MoveNet model
//   useEffect(() => {
//     const loadModel = async () => {
//       try {
//         // Wait for TensorFlow.js to be ready
//         await tf.ready();
//         detectorRef.current = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet);
//         setIsModelLoaded(true);
//         console.log('MoveNet model loaded');
//       } catch (error) {
//         console.error('Error loading MoveNet model:', error);
//       }
//     };

//     loadModel();
//   }, []);

//   // Load the classification model
//   const [classificationModel, setClassificationModel] = useState(null);
  
//   useEffect(() => {
//     const loadClassificationModel = async () => {
//       try{
//         const model2 = await tf.loadLayersModel('indexeddb://my-model3');
//         setClassificationModel(model2);
//         console.log('Classification model loaded');
//       }catch{
//         console.log('false')
//       }
//     };

//     loadClassificationModel();
//   }, []);

//   // Run pose detection on the webcam feed
//   useEffect(() => {
//     const detectPose = async () => {
//       if (!detectorRef.current || !webcamRef.current || !webcamRef.current.video) {
//         return;
//       }

//       const video = webcamRef.current.video;

//       // Wait for the video to be ready
//       if (video.readyState !== 4) {
//         requestAnimationFrame(detectPose);
//         return;
//       }

//       const videoWidth = video.videoWidth;
//       const videoHeight = video.videoHeight;

//       // Set canvas size to match video size
//       canvasRef.current.width = videoWidth;
//       canvasRef.current.height = videoHeight;

//       const ctx = canvasRef.current.getContext('2d');

//       const runDetection = async () => {
//         try {
//           const poses = await detectorRef.current.estimatePoses(video, {
//             maxPoses: 1,
//             flipHorizontal: true, // Flip the video horizontally for pose estimation
//           });

//           drawResults(poses, ctx, videoWidth, videoHeight);
//         } catch (error) {
//           console.error('Error during pose estimation:', error);
//         }

//         requestAnimationFrame(runDetection);
//       };

//       runDetection();
//     };

//     detectPose();
//   }, [isModelLoaded]);

//   const playSound = () => {
//     sound.play();
//   };

//   const drawResults = (poses, ctx, videoWidth, videoHeight) => {
//     ctx.clearRect(0, 0, videoWidth, videoHeight);

//     const keypointNames = [
//       'nose', 'leftEye', 'rightEye', 'leftEar', 'rightEar',
//       'leftShoulder', 'rightShoulder', 'leftElbow', 'rightElbow',
//       'leftWrist', 'rightWrist', 'leftHip', 'rightHip',
//       'leftKnee', 'rightKnee', 'leftAnkle', 'rightAnkle',
//     ];

//     poses.forEach((pose) => {
//       const keypoints = pose.keypoints;

//       if (keypoints.length > 0) {
//         let leftEyeY = null;

//         // Find the Y-coordinate of the LeftEye
//         keypoints.forEach((keypoint, index) => {
//           if (keypoint.score > 0.5 && keypointNames[index] === 'leftEye') {
//             leftEyeY = keypoint.y; // Get the Y-coordinate of LeftEye
//           }
//         });

//         // Check wrist positions relative to LeftEye
//         keypoints.forEach((keypoint, index) => {
//           if (keypoint.score > 0.5) {
//             const partName = keypointNames[index];
//             const flippedY = keypoint.y; // Use the unflipped Y-coordinate for comparison

//             if ((partName === 'leftKnee' || partName === 'rightKnee') && leftEyeY !== null) {
//               const Kneestate = state[partName]; // Get the current state of the wrist

//               if (flippedY < leftHip && Kneestate !== 'above') {
//                 // Wrist moves above the LeftEye
//                 state[partName] = 'above';
//                 console.log(`${partName} is now above LeftEye`);
//               } else if (flippedY > leftHip && Kneestate === 'above') {
//                 // Wrist moves below the LeftEye after being above
//                 state[partName] = 'below';
//                 counter++;
//                 setCount(counter);
//                 playSound();
//                 console.log(`Count incremented! Current count: ${counter}`);
//               }
//             }

//             // Draw keypoint
//             const flippedX = videoWidth - keypoint.x;
//             ctx.fillStyle = 'red';
//             ctx.beginPath();
//             ctx.arc(flippedX, flippedY, 5, 0, 2 * Math.PI);
//             ctx.fill();
//           }
//         });

//         // Classification logic
//         if (classificationModel) {
//           const keypointsForClassification = keypoints.map((keypoint) => [keypoint.x, keypoint.y]);
//           const inputTensor = tf.tensor([keypointsForClassification]);

//           classificationModel.predict(inputTensor).then((predictions) => {
//             console.log('Classification Predictions:', predictions);
//             // You can use the predictions here to add conditions or display classification results
//           });
//         }else{
//           console.log('nothing')
//         }

//         // Bounding box calculation (unchanged)
//         let minX = videoWidth, minY = videoHeight, maxX = 0, maxY = 0;
//         keypoints.forEach((keypoint) => {
//           if (keypoint.score > 0.5) {
//             const flippedX = videoWidth - keypoint.x;
//             const flippedY = keypoint.y;

//             minX = Math.min(minX, flippedX);
//             minY = Math.min(minY, flippedY);
//             maxX = Math.max(maxX, flippedX);
//             maxY = Math.max(maxY, flippedY);
//           }
//         });

//         // Draw bounding box
//         if (maxX > minX && maxY > minY) {
//           const boxWidth = maxX - minX;
//           const boxHeight = maxY - minY;

//           ctx.beginPath();
//           ctx.rect(minX, minY, boxWidth, boxHeight);
//           ctx.lineWidth = 2;
//           ctx.strokeStyle = 'green';
//           ctx.stroke();
//         }
//       }
//     });
//   };

//   return (
//     <div className="flex flex-col w-full h-full bg-gray-800 items-center justify-center">
//       {/* Container for Webcam and Canvas */}
//       <div className="w-[80vw] h-[100vh]">
//         <Webcam
//           ref={webcamRef}
//           className="absolute top-20 left-0 w-full h-full object-cover rounded-lg"
//           videoConstraints={{
//             width: 1280,
//             height: 720,
//             facingMode: 'user',
//           }}
//           mirrored={true} // Flip the video feed for better alignment
//         />
//         <canvas
//           ref={canvasRef}
//           // hidden
//           className="absolute top-20 left-0 w-full h-full rounded-lg"
//         />
//       </div>

//       {/* Loading Overlay */}
//       {!isModelLoaded && (
//         <div className="absolute inset-0 bg-black opacity-50 flex justify-center items-center">
//           <p className="text-white">Loading model...</p>
//         </div>
//       )}

//       {/* Footer Text */}
//       <div className="text-white mt-4">{count}</div>
//     </div>
//   );
// };


// export default PoseEstimatorWithWebcam;
