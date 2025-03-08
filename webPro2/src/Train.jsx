import React, { useEffect, useRef, useState } from 'react';


const TrainModel = () => {
  const [csvData, setCsvData] = useState([]);
  const [trainingStatus, setTrainingStatus] = useState('');
  const [isTraining, setIsTraining] = useState(false);

  // Handle CSV file upload and parsing
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Parse CSV using PapaParse
    Papa.parse(file, {
      header: true, // Parse the first row as header
      skipEmptyLines: true,
      complete: (result) => {
        setCsvData(result.data); // Save parsed data
        alert("CSV data loaded successfully!");
      },
      error: (error) => {
        console.error("Error parsing CSV file:", error);
      },
    });
  };

  // Train the model using the parsed CSV data
  const handleTrainModel = async () => {
    if (csvData.length === 0) {
      alert("Please upload a CSV file with data first!");
      return;
    }

    setIsTraining(true);
    setTrainingStatus('Training started...');

    await tf.ready();

    // Prepare features (xs) and labels (ys) from csvData
    const xsData = csvData.map((row) => [
      parseFloat(row.feature1),
      parseFloat(row.feature2),
      parseFloat(row.feature3),
      parseFloat(row.feature4),
    ]);

    const ysData = csvData.map((row) => {
      const label = parseInt(row.label, 10); // Assuming labels are integers
      const oneHot = Array(3).fill(0); // 3 classes
      oneHot[label] = 1;
      return oneHot;
    });

    // Convert to tensors
    const xs = tf.tensor2d(xsData);
    const ys = tf.tensor2d(ysData);

    // Define the model
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 16, activation: 'relu', inputShape: [4] }));
    model.add(tf.layers.dense({ units: 3, activation: 'softmax' })); // 3 classes

    // Compile the model
    model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });

    // Train the model
    await model.fit(xs, ys, {
      epochs: 10,
      batchSize: 4,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          setTrainingStatus(`Epoch ${epoch + 1}: Loss = ${logs.loss.toFixed(4)}, Accuracy = ${logs.acc?.toFixed(4)}`);
        },
      },
    });

    setTrainingStatus('Training complete!');
    setIsTraining(false);

    // Save the model (optional)
    await model.save('downloads://my-trained-model');
  };

  return (
    <div>
      <h1>Train Model from CSV</h1>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <button onClick={handleTrainModel} disabled={isTraining}>
        {isTraining ? 'Training...' : 'Start Training'}
      </button>
      <p>{trainingStatus}</p>
    </div>
  );
};


// import React, { useEffect, useState } from 'react';
// import * as tf from '@tensorflow/tfjs';

const UseModel = () => {
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [status, setStatus] = useState('Loading model...');

  useEffect(() => {
    // Load the model asynchronously
    const loadModel = async () => {
      // Ensure TensorFlow.js is ready
      await tf.ready();

      // Load the model
      try {
        const loadedModel = await tf.loadLayersModel('./public/model/my-trained-model.json');
        setModel(loadedModel);
        setStatus('Model loaded successfully!');
      } catch (error) {
        setStatus('Error loading model: ' + error.message);
      }
    };

    loadModel();
  }, []);

  const handlePredict = () => {
    if (model) {
      // Sample data for prediction (ensure the input shape matches the model's input)
      const input = tf.tensor2d([[1, 0, 0, 0]]); // Modify this based on your model's expected input

      // Make a prediction
      const output = model.predict(input);
      
      // Get the prediction result
      output.array().then(array => {
        setPrediction(array);
      });
    }
  };

  return (
    <div>
      <h1>Use Trained Model</h1>
      <p>{status}</p>
      <button onClick={handlePredict}>Make Prediction</button>
      {prediction && (
        <div>
          <h2>Prediction:</h2>
          <pre>{JSON.stringify(prediction, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

// import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import Papa from 'papaparse';

const PoseDetectionComponent = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [keypoints, setKeypoints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageWidth, setImageWidth] = useState(null);
  const [imageHeight, setImageHeight] = useState(null);
  const [resizedImageSrc, setResizedImageSrc] = useState(null);

  // Function to handle image file upload and resize
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        resizeImage(reader.result);  // Resize the image when uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to resize the image to a specific width and height
  const resizeImage = (imageData) => {
    const img = new Image();
    img.src = imageData;

    img.onload = () => {
      const maxWidth = 640;  // Desired width
      const maxHeight = 480; // Desired height

      // Calculate the new dimensions while maintaining aspect ratio
      const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
      const newWidth = img.width * ratio;
      const newHeight = img.height * ratio;

      // Create a canvas to resize the image
      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext('2d');

      // Draw the resized image on the canvas
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      // Get the resized image as a data URL
      const resizedImage = canvas.toDataURL();
      setResizedImageSrc(resizedImage);

      setImageWidth(newWidth);
      setImageHeight(newHeight);
    };
  };

  // Function to load the model and predict keypoints from the resized image
  const predictPose = async (imageElement) => {
    setIsLoading(true);

    // Ensure TensorFlow.js is ready before proceeding
    await tf.ready();

    // Load the MoveNet model
    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet);

    // Estimate pose from the resized image
    const poses = await detector.estimatePoses(imageElement);
    setKeypoints(poses[0].keypoints);

    setIsLoading(false);
  };

  // Function to convert keypoints to percentages based on image size
  const convertKeypointsToPercentages = () => {
    if (!imageWidth || !imageHeight) return [];

    return keypoints.map((keypoint) => ({
      part: keypoint.name,
      x: (keypoint.x / imageWidth) * 100,
      y: (keypoint.y / imageHeight) * 100,
      score: keypoint.score,
    }));
  };

  // Convert the keypoints to CSV and download the file in the desired structure
  const exportToCSV = () => {
    if (keypoints.length === 0) {
      alert("No keypoints detected!");
      return;
    }

    // Flatten the keypoints into the structure "nose_x,nose_y,eyes_left_x,eyes_left_y,...,score"
    const data = convertKeypointsToPercentages().reduce((acc, keypoint) => {
      // Add x and y coordinates to the row
      acc.push(keypoint.x, keypoint.y);
      return acc;
    }, []);

    // Add the score at the end
    data.push(keypoints[0].score);

    // Generate CSV
    const headers = [];
    keypoints.forEach((keypoint) => {
      headers.push(`${keypoint.name}_x`, `${keypoint.name}_y`);
    });
    headers.push("score");

    // Create CSV from data
    const csv = Papa.unparse([headers, data]);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'keypoints.csv');
    link.click();
  };

  return (
    <div>
      <h2>Pose Detection</h2>

      {/* Image Upload */}
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {/* Display Resized Image */}
      {resizedImageSrc && (
        <img
         className='mx-auto'
          src={resizedImageSrc}
          alt="Resized"
          onLoad={(e) => predictPose(e.target)}
          style={{ maxWidth: '100%', marginTop: '10px' }}
        />
      )}

      {/* Loading Indicator */}
      {isLoading && <p>Loading...</p>}

      {/* Display Detected Keypoints */}
      {keypoints.length > 0 && (
        <div >
          <h3>Detected Keypoints:</h3>
          <pre className='grid grid-cols-4'>{JSON.stringify(convertKeypointsToPercentages(), null, 2)}</pre>
          <button onClick={exportToCSV}>Export Keypoints to CSV</button>
        </div>
      )}
    </div>
  );
};

  const PoseDetectionComponent2 = () => {
    const [image, setImage] = useState(null);
    const [pose, setPose] = useState(null);
    const [isPredicted, setIsPredicted] = useState(false);
  
    // Load Pose Detection model
    const loadModel = async () => {
      await tf.setBackend('webgl'); // Use 'cpu' if you need to run without GPU
      const model = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet); // Corrected model loading method
      return model;
    };
  
    const predictPose = async (image) => {
        const model = await loadModel();
      
        // Convert the image to a Tensor (without resizing)
        const tensorImage = tf.browser.fromPixels(image);
      
        // Predict the pose using the model
        const pose = await model.estimateSinglePose(tensorImage, {
          flipHorizontal: false,
        });
      
        if (!pose || !pose.keypoints) {
          console.error("Pose data is unavailable or invalid.");
          return;
        }
      
        setPose(pose); // Update state with the detected pose
      };
      
      
  
    // Handle image upload
    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setImage(img);
        setPose(null);
        setIsPredicted(false);
      };
    };
  
    const drawPose = (canvas, pose) => {
        if (!pose || !pose.keypoints) {
          console.error("Pose data is unavailable or invalid.");
          return;
        }
      
        const ctx = canvas.getContext('2d');
        const keypoints = pose.keypoints;
      
        keypoints.forEach((keypoint) => {
          const { position, score } = keypoint;
          if (score > 0.5) { // Only draw keypoints with a score > 0.5
            ctx.beginPath();
            ctx.arc(position.x, position.y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill();
          }
        });
      
        // Draw skeleton (lines connecting keypoints)
        const adjacentKeyPoints = poseDetection.getAdjacentKeyPoints(keypoints, 0.5);
        adjacentKeyPoints.forEach(([start, end]) => {
          ctx.beginPath();
          ctx.moveTo(start.position.x, start.position.y);
          ctx.lineTo(end.position.x, end.position.y);
          ctx.strokeStyle = 'blue';
          ctx.lineWidth = 2;
          ctx.stroke();
        });
      };
      
  
    return (
      <div>
        <h1>Pose Detection in React</h1>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {image && (
          <div>
            <h2>Original Image</h2>
            <div>
              <img  src={image.src} alt="Uploaded" width="400" />
            </div>
            <button onClick={() => predictPose(image)}>Predict Pose</button>
            {isPredicted && (
              <div>
                <h2>Pose Estimation</h2>
                <canvas
                  width={image.width}
                  height={image.height}
                  ref={(canvas) => {
                    if (canvas && pose) {
                      drawPose(canvas, pose);
                    }
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  const Train2 = () => {
    const [pose, setPose] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const canvasRef = useRef(null);
    const videoRef = useRef(null);
  
    // Load Pose Detection model
    const loadModel = async () => {
      setIsLoading(true);
      const model = await posedetection.createDetector(posedetection.SupportedModels.MoveNet, {
        modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING, // Model type (e.g., LIGHTNING or THUNDER)
      });
      setIsLoading(false);
      return model;
    };
  
    // Start video stream
    const setupCamera = async () => {
      const video = videoRef.current;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      video.srcObject = stream;
      video.play();
    };
  
    // Handle image and pose prediction
    const predictPose = async (image) => {
      const model = await loadModel();
  
      // Convert the image to a Tensor
      const tensorImage = tf.browser.fromPixels(image);
  
      // Resize the image to the input size expected by the model (if needed)
      const resizedImage = tf.image.resizeBilinear(tensorImage, [192, 192]); // Resize to 192x192 (example)
  
      // Normalize the image to [0, 1] range if required
      const normalizedImage = resizedImage.div(tf.scalar(255.0));
  
      // Predict the pose using the model
      const poseData = await model.estimateSinglePose(normalizedImage, {
        flipHorizontal: false,
      });
  
      // Ensure pose data is available
      if (!poseData || !poseData.keypoints) {
        console.error("Pose data is unavailable or invalid.");
        return;
      }
  
      // Set pose data
      setPose(poseData);
    };
  
    // Draw pose on canvas
    const drawPose = (poseData) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous pose
  
      poseData.keypoints.forEach((keypoint) => {
        const { x, y, score } = keypoint;
  
        // Only draw keypoints with a high confidence score
        if (score >= 0.5) {
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = 'red';
          ctx.fill();
        }
      });
    };
  
    useEffect(() => {
      setupCamera();
    }, []);
  
    useEffect(() => {
      if (pose) {
        drawPose(pose);
      }
    }, [pose]);
  
    return (
      <div>
        <h1>Pose Detection</h1>
        <div>
          <video ref={videoRef} width="640" height="480" style={{ display: 'none' }} />
          <canvas ref={canvasRef} width="640" height="480" style={{ border: '1px solid black' }} />
        </div>
  
        {isLoading ? (
          <p>Loading model...</p>
        ) : (
          <button onClick={() => predictPose(videoRef.current)}>
            Detect Pose
          </button>
        )}
      </div>
    );
  };

  // const PoseCSVInput = () => {
  //   const [model, setModel] = useState(null);
  //   const [csvData, setCsvData] = useState(null);
  
  //   // Function to read CSV data and parse it
  //   const handleFileUpload = (event) => {
  //     const file = event.target.files[0];
  //     if (file) {
  //       Papa.parse(file, {
  //         complete: (result) => {
  //           console.log("Parsed CSV Data:", result.data);  // Log the parsed CSV data
  //           setCsvData(result.data);  // Store parsed data in state
  //         },
  //         header: false,  // Assuming the file doesn't have headers
  //       });
  //     }
  //   };
  
  //   const processData = (data) => {
  //     const features = data.map(row => row.slice(0, -2).map(val => {
  //       const parsedVal = parseFloat(val);
  //       if (isNaN(parsedVal)) {
  //         console.error(`Invalid value found: ${val}`);  // Log invalid value
  //         return 0;  // Replace NaN values with 0 (or any placeholder value)
  //       }
  //       return parsedVal;
  //     }));
    
  //     const labels = data.map(row => row.slice(-2).map(val => {
  //       const parsedVal = parseFloat(val);
  //       if (isNaN(parsedVal)) {
  //         console.error(`Invalid value found in labels: ${val}`);  // Log invalid value in labels
  //         return 0;  // Replace NaN values with 0 (or any placeholder value)
  //       }
  //       return parsedVal;
  //     }));
    
  //     console.log("Processed Features:", features);
  //     console.log("Processed Labels:", labels);
    
  //     const xs = tf.tensor2d(features);
  //     const ys = tf.tensor2d(labels);
    
  //     return { xs, ys };
  //   };
  
  //   // Function to train the model
  //   const trainModel = async () => {
  //     await tf.ready();  // Ensure TensorFlow.js is ready before training
  
  //     if (csvData) {
  //       const { xs, ys } = processData(csvData);
  
  //       // Define a Sequential model
  //       const model = tf.sequential();
  //       model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [xs.shape[1]] }));
  //       model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
  //       model.add(tf.layers.dense({ units: 2 }));  // Output layer with 2 units (score and class)
  
  //       model.compile({ loss: 'meanSquaredError', optimizer: 'adam' });
  
  //       // Train the model
  //       await model.fit(xs, ys, { epochs: 100 });
  //       console.log('Model trained!');
  //       setModel(model);  // Save the trained model to state
  //     }
  //   };
  
  //   // Function to save and download the model
  //   const saveModel = async () => {
  //     if (model) {
  //       await model.save('indexeddb://my-model3');
  //       // alert('model was saved!');
  //       async function loadModel() {
  //         try {
  //           let model2 = await tf.loadLayersModel('indexeddb://my-model3');
  //           console.log('Model loaded from IndexedDB');
  //         } catch (error) {
  //           console.error('Error loading model:', error);
  //         }
  //       }
  //       loadModel();
  //       const modelJson = await model.toJSON();
  //       const modelWithWeights = JSON.stringify(modelJson);
  //       // Save the model as a Blob with base64-encoded weights
  //       const blob = new Blob([modelWithWeights], { type: 'application/json' });
  //       const link = document.createElement('a');
  //       link.href = URL.createObjectURL(blob);
  //       link.download = 'model.json';  // Save the model file with weights embedded
  //       link.click();
  //     } else {
  //       alert('No model to save!');
  //     }
  //   };
  //   useEffect(() => {
  //     const loadModel = async () => {
  //       try {
  //         // Load the model from the local path or URL where model.json is located
  //         const modelPath = '/public/models/model.json'; // Update with your model's path
  //         const loadedModel = await tf.loadGraphModel(modelPath);
  //         setModel(loadedModel);
  //         console.log('Model loaded successfully');
  //       } catch (error) {
  //         console.error('Error loading model:', error);
  //       }
  //     };
  
  //     loadModel();
  //   }, []);
  
  //   // Function to predict with the trained model
  //   const predict = (inputData) => {
  //     if (model) {
  //       // Prepare input data by selecting keypoints (the first 34 values)
  //       const input = tf.tensor2d([inputData.slice(0, 34)], [1, 34]); // Make sure it's in the shape [1, 34]
        
  //       const output = model.predict(input);
  //       output.print();  // Print the prediction result (score and class)
  //     }
  //   };
  
  //   // Example input data for testing (you can replace this with actual input)
  //   const exampleInputData = [
  //     56.5155069,16.8634304,55.9081002,15.89855881,55.70350537,15.83798956,51.18557626,16.57198099,49.17279304,16.32507394,48.92516898,23.11249773,45.52488428,23.16510131,49.94351448,39.56041733,49.23170128,40.22454023,55.09388547,52.26982037,55.17464299,53.20737759,51.11797888,50.47442118,50.67586509,51.04908943,46.99228357,70.50534487,47.20015654,71.10060056,43.50752594,82.15450048,45.29761618,82.27291902,0.160415277
  //   ];
  
  //   return (
  //     <div>
  //       <input type="file" accept=".csv" onChange={handleFileUpload} />
  //       <button className='m-1 p-2 bg-blue-300' onClick={trainModel}>Train Model</button>
  //       <button className='m-1 p-2 bg-blue-300' onClick={() => predict(exampleInputData)}>Test Model</button>
  //       <button className='m-1 p-2 bg-blue-300' onClick={saveModel}>Download Model</button> {/* Save Model Button */}
  //     </div>
  //   );
  // };


  const PoseCSVInput = () => {
  const [model, setModel] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          setCsvData(result.data);
        },
        header: false,
      });
    }
  };

  const processData = (data) => {
    const features = data.map(row => row.slice(0, -2).map(val => parseFloat(val)));
    const labels = data.map(row => row.slice(-2).map(val => parseFloat(val)));
    const xs = tf.tensor2d(features);
    const ys = tf.tensor2d(labels);
    return { xs, ys };
  };

  const trainModel = async () => {
    await tf.ready();
    if (csvData) {
      const { xs, ys } = processData(csvData);
      const model = tf.sequential();
      model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [xs.shape[1]] }));
      model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
      model.add(tf.layers.dense({ units: 2 }));
      model.compile({ loss: 'meanSquaredError', optimizer: 'adam' });
      await model.fit(xs, ys, { epochs: 100 });
      setModel(model);
    }
  };

  const saveModel = async () => {
    if (model) {
      await model.save('localstorage://my-model');
      alert('Model saved!');
    }
  };

  const loadModel = async () => {
    try {
      const loadedModel = await tf.loadLayersModel('localstorage://my-model');
      setModel(loadedModel);
      alert('Model loaded successfully!');
    } catch (error) {
      alert('Error loading model');
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <button onClick={trainModel}>Train Model</button>
      <button onClick={saveModel}>Save Model</button>
      <button onClick={loadModel}>Load Model</button>
    </div>
  );
};








  const PoseEstimationWithPrediction = () => {
    const [model, setModel] = useState(null); // Store the loaded model
    const [prediction, setPrediction] = useState(null); // Store the prediction result
    const [inputData, setInputData] = useState(''); // Input data for prediction
  
    // Load model on component mount
    useEffect(() => {
      const loadModel = async () => {
        try {
          await tf.ready();  // Ensure TensorFlow.js is ready
          // Load model from the public folder, path relative to the public directory
          const model = await tf.loadLayersModel('https://192.168.1.194:5000/modelsTest/model.json'); 
          setModel(model);  // Set the loaded model in state
          console.log('Model loaded successfully!');
        } catch (error) {
          console.error('Error loading model:', error);
        }
      };
      loadModel();
    }, []);
  
    // Handle input change
    const handleInputChange = (event) => {
      setInputData(event.target.value);
    };
  
    // Make a prediction based on the input data
    const makePrediction = async () => {
      if (model && inputData) {
        // Convert the input string to a float array or tensor depending on your model input format
        const inputArray = inputData.split(',').map(val => parseFloat(val.trim()));
        const inputTensor = tf.tensor2d([inputArray]);
  
        // Predict using the model
        const result = model.predict(inputTensor);
        const predictionValue = result.dataSync()[0]; // Assuming the model outputs a single value
  
        setPrediction(predictionValue); // Set the prediction value to display
      }
    };
  
    return (
      <div>
        <h2>TensorFlow.js Prediction</h2>
        <input
          type="text"
          value={inputData}
          onChange={handleInputChange}
          placeholder="Enter input data (comma-separated)"
        />
        <button onClick={makePrediction}>Predict</button>
  
        {prediction !== null && (
          <div>
            <h3>Prediction Result: {prediction}</h3>
          </div>
        )}
      </div>
    );
  };
  
export {TrainModel,UseModel,PoseDetectionComponent,PoseDetectionComponent2,Train2,PoseCSVInput,PoseEstimationWithPrediction};
