const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const http = require('http');
const { spawn } = require('child_process');
const path = require('path');
const {User,Data,userImage} = require('./Models/User2');
const {Exercise,Level,ExerciseImage,History} = require('./Models/Exersies');
const {Btext} = require('./Models/BWord');
const https = require('https');
const fs = require('fs');
const os = require('os');
const bodyParser = require('body-parser');
require('dotenv').config();
const helmet = require('helmet');
const { log } = require('console');
const secret = 'qwerty'
const axios = require("axios");
const { param } = require('express-validator');
const localIP = "192.168.1.196"
const myIp  = os.networkInterfaces();
console.log(myIp)
const PORT = process.env.PORT || 5000;
const app = express();
const https_options = {
    cert: fs.readFileSync("./my.cert"),
    key: fs.readFileSync("./my.key"),
};
app.use(express.json());
app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
}));

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/auth-demo', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
connectDB()
app.use(bodyParser.json());
const moDirectory = path.join(__dirname, 'mo');
if (!fs.existsSync(moDirectory)) {
    fs.mkdirSync(moDirectory);
}
const storageImgExer = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'exerimgs/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  const storageR = multer.memoryStorage();
  const storageUpTP = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploadsTP/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

  const uploadimgexer   = multer({ storage:storageImgExer });
  const upload = multer({ storage: storage });
  const uploadTP = multer({ storage: storageUpTP });
  // const UmoS = multer({ storage: Umo });
const agent = new https.Agent({
  rejectUnauthorized: false, // Ignore self-signed certificate
});
const storageRs = multer.memoryStorage(); // Or diskStorage depending on your setup
const uploadR = multer({ storage: storageRs }).single('modelFile');

app.use('/exerimgs', express.static(path.join(__dirname, 'exerimgs')));
app.post('/register', async (req, res) => {
  const { username, password, email, dateOfBirth } = req.body;
  try {
      if (!username || !password || !email || !dateOfBirth) {
          return res.status(400).json({ msg: 'All fields are required' });
      }
      const existingBtext = await Btext.findOne({ Btext: username });
      if (existingBtext) {
          return res.status(400).json({ msg: `Username isn't allow touse` });
      }
      const existingBtext2 = await User.findOne({ username: username });
      if (existingBtext2) {
          return res.status(400).json({ msg: `Username is already exist` });
      }
      const role = 'user';
      const useR = new User({
          username,
          password,
          email,
          dateOfBirth,
          role,
      });

      const salt = await bcrypt.genSalt(10);
      useR.password = await bcrypt.hash(password, salt);

      await useR.save();

      res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).send('User not found');
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        // console.log(username,password,isMatch)
        return res.status(401).send('Invalid credentials');
      }
      let token = await generateToken(user);
      res.json({ token:token,id: user._id, username: user.username,role: user.role });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
  function generateToken(user) {
    return jwt.sign({ id: user._id, username: user.username }, secret, { expiresIn: '20h' });
  }
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out' });
        }
        res.clearCookie('connect.sid'); // If using cookies
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

app.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const image = await userImage.findOne({userId:req.params.id}).sort({ uploadDate: -1 }); // Exclude password
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json({user:user,image:image});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
app.get('/userData', async (req, res) => {
    try {
        const userdata = await User.find();
        // console.log('Fetched user data:', userdata);
        res.json(userdata);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
app.delete('/deleteUser/:id', async (req,res)=>{
  const userId = req.params.id;

  try {
      const deletedUser = await User.findByIdAndDelete(userId); // Delete user by ID
      if (!deletedUser) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Server error', error });
  }
});
app.put('/api/user/:id/edit', upload.single('profileImage'), async (req, res) => {
    const { id } = req.params;
    const { username, email, role, dateOfBirth } = req.body;
    try {
      const updatedData = {
        username,
        email,
        role,
        dateOfBirth,
        ...(req.file && { profileImage: req.file.path }), // Add profileImage if a file is uploaded
      };
  
      const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating profile' });
    }
  });
  
app.post('/analyze/:id',async (req, res) => {
  const { AnalyzeLevel,userId } = await req.body;
  const analyseMha = new Level({
    userId,
    AnalyzeLevel,
  })
  await analyseMha.save();
  res.status(201).json({ msg: 'analyze save successfully' });
})


app.get('/analyze/:id',async (req, res) => {
  try {
    const Fimage = await Level.findOne({userId:req.params.id}).sort({ 
      createdAt: 1 });
    const Limage = await Level.findOne({userId:req.params.id}).sort({ 
      createdAt: -1 }); 
    const Aimage = await Level.find({userId:req.params.id})
    if (!Fimage || !Limage || !Aimage) {
        return res.status(404).json({ msg: 'User not found' });
    }
    res.json({F:Fimage,L:Limage,A:Aimage});
} catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
}
})


app.get('/latestLevels', async (req, res) => {
  try {
    const levels = await Level.aggregate([
      { $group: { _id: "$userId", latestLevel: { $last: "$AnalyzeLevel" } } },
      { $sort: { latestLevel: 1 } }  // Sort by AnalyzeLevel or any criteria
    ]);

    if (!levels) {
      return res.status(404).json({ msg: 'No user levels found' });
    }

    res.json(levels);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


app.post('/exsersice2/:id',async (req, res) => {
  const { exercisename,userId,exerciseId } = await req.body;
  const analyseMha = new History({
    userId,
    exercisename,
    exerciseId,
  })
  await analyseMha.save();
  res.status(201).json({ msg: 'analyze save successfully' });
})

app.get('/api/exsersice2/:id',async (req, res) => {
  try {
    const Fimage = await History.find({ userId: req.params.id })
    res.json(Fimage);
} catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
}
})

app.get('/user/:id/exercises', async (req, res) => {
  try {
    const userId = req.params.id;
    const limit = 10;
    const history = await History.find({ userId })
      .populate('exerciseId')
      .limit(limit);
    const images = await ExerciseImage.find({ exerciseId: { $in: history.map(h => h.exerciseId) } })
      .limit(limit);
    const analysis = await Level.find({ userId })
      .sort({ AnalyzeDate: -1 })
    res.json({ history, images, analysis });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user exercises', error });
  }
});


app.post('/upload', upload.single('image'), async (req, res) => {
  const { userId } = req.body;
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const image = new userImage({
    userId: userId,
    filename: req.file.filename,
    imagePath: req.file.path
  });
  try {
    await image.save();
    res.json({ message: 'File uploaded and saved to database', filePath: req.file.path });
  } catch (error) {
    console.error('Error saving to DB:', error);
    res.status(500).json({ message: 'Failed to save file to database', error });
  }
});

app.get('/images/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const images = await userImage.findOne({userId:id}).sort({ uploadDate: -1 });
    if (images.length === 0) {
      return res.status(404).json({ message: 'No images found' });
    }
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Error fetching images', error });
  }
});

app.post('/api/exercises', uploadimgexer.single('image'),async (req, res) => {
  try {
    const { exerciseName, description, repeats, sets, modelUrl } = req.body;
    const existingExercise = await Exercise.findOne({ exercisename:exerciseName });
    console.log(exerciseName)
    // console.log(req.file)
    if (existingExercise) {
        return res.status(400).json({ message: 'Exercise with this name already exists.' });
    }
    const imagePath = req.file ? `/exerimgs/${req.file.filename}` : null; // Only the filename or path
    const filename = req.file ? req.file.originalname : null;
    // const filename = req.file.originalname
    const exercise = new Exercise({
      exercisename:exerciseName,
      describtion:description,
      replete:repeats,
      set:sets,
      model_url:modelUrl
    });
    const savedExercise = await exercise.save();
    if (imagePath) {
      const exerciseImage = new ExerciseImage({
        exerciseId: savedExercise._id,
        filename: filename,
        imagePath,
      });
      await exerciseImage.save();
    }

    // console.log({ exerciseName, description, imagePath, repeats, sets, modelUrl });
    res.status(200).json({
      message: 'Exercise data submitted successfully',
      data: { exerciseName, description, imagePath, repeats, sets, modelUrl },
    });
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ message: 'Failed to submit exercise data' });
  }
});
app.get('/api/exercises', async (req, res) => {
  try {
    const exercises = await Exercise.find();
    const exercisesWithImages = await Promise.all(
      exercises.map(async (exercise) => {
        const images = await ExerciseImage.find({ exerciseId: exercise._id });
        return {
          ...exercise.toObject(),
          images: images.map(image => ({
            filename: image.filename,
            imagePath: image.imagePath,
            uploadDate: image.uploadDate,
          })),
        };
      })
    );

    res.status(200).json({
      message: 'Exercises retrieved successfully',
      data: exercisesWithImages,
    });
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ message: 'Failed to retrieve exercises' });
  }
});

app.get('/exercises/:id', async (req, res) => {
  try {
    const exerciseId = req.params.id;
    const images = await ExerciseImage.find({ exerciseId: exerciseId });

    if (images.length === 0) {
      return res.status(404).json({ message: 'No images found for this exercise' });
    }

    res.status(200).json({
      message: 'Images retrieved successfully',
      data: images,
    });
  } catch (error) {
    console.error('Error retrieving images:', error);
    res.status(500).json({ message: 'Failed to retrieve images' });
  }
});
app.get('/exercises', async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.status(200).json({
      message: 'Exercises retrieved successfully',
      data: exercises,
    });
  } catch (error) {
    console.error('Error retrieving exercises:', error);
    res.status(500).json({ message: 'Failed to retrieve exercises' });
  }
});
app.get('/dashData',async (req,res) => {
  try {
    const userData = await User.find();
    res.status(200).json({
      data: userData,
    });
  } catch (error) {
    console.error('Error retrieving exercises:', error);
    res.status(500).json({ message: 'Failed to retrieve exercises' });
  }
})
app.post('/uploadToPy/:id', uploadTP.single('imageTP'), async (req, res) => {
  try {
    const userId = req.params.id
    console.log(userId)
    const imagePath = path.resolve(__dirname, req.file.path);
    const pythonScriptPath = 'D:/Python_BarPro/Test_HPE/testten2.py';
    const formattedImagePath = imagePath.replace(/\\/g, '/');
    const condaActivateCmd = `conda activate ultralytics-env && python "${pythonScriptPath}" "${formattedImagePath}"`;
    const pythonProcess = spawn(condaActivateCmd, { shell: true });
    let pythonOutput = '';
    pythonProcess.stdout.on('data', (data) => {
      pythonOutput += data.toString();
      console.log(pythonOutput);
    });
    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data.toString()}`);
    });
    pythonProcess.on('close',async (code) => {
      if (code === 0) {
        try {
          const outputData = JSON.parse(pythonOutput.trim());
          console.log("Parsed Python Output:", outputData);
          const angle = outputData.angle;
          const angleres = outputData.angleres;
          const angleresR = outputData.angleresR;
          const LevelR = outputData.LevelR;
          const analyseMha = new Level({
            userId: userId,
            AnalyzeLevel: LevelR,
          })
          await analyseMha.save();
          res.status(200).json({
            message: 'Python script executed successfully',
            angle: angle,
            angleres: angleres,
            angleresR: angleresR,
            LevelR: LevelR
          });
        } catch (jsonError) {
          console.error('Error parsing Python output:', jsonError);
          res.status(500).json({ message: 'Error parsing Python output', error: jsonError.message });
        }
      } else {
        res.status(500).json({ message: 'Python script execution failed', code });
      }
    });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ message: 'Error processing image', error: error.message });
  }
});

app.post("/upload-csv", async (req, res) => {
  try {
    const data = req.body;  // The CSV data sent from React
    if (data.length === 0) {
      return res.status(400).json({ message: "No data to upload." });
    }
    console.log(data)
    // Insert the data into MongoDB
    await Btext.insertMany(data);
    res.status(200).json({ message: "Data uploaded successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading data." });
  }
});
app.put('/api/users/update-username', async (req, res) => {
  try {
    const { userId, username } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username },
      { new: true }
    );
    res.status(200).json({ message: 'Username updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating username:', error);
    res.status(500).json({ message: 'Failed to update username' });
  }
});


app.use('/uploads', express.static('uploads'));
app.use('/exerimgs', express.static('exerimgs'));
app.use('/modelsTest', express.static(path.join(__dirname, 'mo')));
app.use('/models', express.static(path.join(__dirname, 'models')));

const httpServer = http.createServer(app);
const httpsServer = https.createServer(https_options, app);
httpsServer.listen(PORT,localIP, () => {
    console.log(`HTTPS Server running on https://${localIP}:${PORT}`);
});
httpServer.listen(5001,localIP, () => {
    console.log(`HTTPS Server running on http://${localIP}:${5001}`);
});


