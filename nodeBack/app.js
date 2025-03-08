// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const User = require('./Models/User');  // Import User model
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(express.json());
// app.use(cors({
//     origin: ['https://192.168.1.194:5173', 'http://localhost:3000'],
//   }));

// // MongoDB connection
// mongoose.connect('mongodb://localhost:27017/auth-demo', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));

// // Routes
// // app.post('/api/register', async (req, res) => {
// //     const { username, password } = req.body;

// //     try {
// //         const userExists = await User.findOne({ username });
// //         if (userExists) return res.status(400).json({ message: 'User already exists' });

// //         const hashedPassword = await bcrypt.hash(password, 10);
// //         const newUser = new User({ username, password: hashedPassword });
// //         await newUser.save();
// //         res.status(201).json({ message: 'User registered successfully' });
// //     } catch (error) {
// //         res.status(500).json({ message: 'Server error' });
// //     }
// // });

// app.post('/register', async (req, res) => {
//     const { username, password } = req.body;
  
//     try {
//       const userExists = await User.findOne({ username });
//       if (userExists) return res.status(400).json({ message: 'User already exists' });
  
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const newUser = new User({ username, password: hashedPassword });
//       await newUser.save();
      
//       res.status(201).json({ message: 'User registered successfully' });
//     } catch (error) {
//       res.status(500).json({ message: 'Server error' });
//     }
//   });

// app.post('/login', async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         const user = await User.findOne({ username });
//         if (!user) return res.status(400).json({ message: 'Invalid credentials' });

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

//         const token = jwt.sign({ id: user._id }, 'jwtSecret', { expiresIn: '1h' });
//         res.json({ token, user: { id: user._id, username: user.username } });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// _________________________________________________________________________

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('./Models/User');  // Import User model

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(express.json());
// app.use(cors({
//     origin: ['https://172.21.32.1:5173'], // Allow your front-end origin
//     methods: ['GET', 'POST'], // Specify allowed methods
//     credentials: true // Allow credentials if needed
// }));

// // MongoDB connection
// mongoose.connect('mongodb://localhost:27017/auth-demo', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));

// // Registration route
// app.post('/register', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const userExists = await User.findOne({ username });
//     if (userExists) return res.status(400).json({ message: 'User already exists' });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ username, password: hashedPassword });
//     await newUser.save();
    
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Login route
// app.post('/api/login', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await User.findOne({ username });
//     if (!user) return res.status(400).json({ message: 'Invalid credentials' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

//     const token = jwt.sign({ id: user._id }, 'jwtSecret', { expiresIn: '1h' });
//     res.json({ token, user: { id: user._id, username: user.username } });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//______________________________________________________________________________________

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const multer = require('multer');
// const path = require('path');
// const User = require('./Models/User');  // Import User model
// const https = require('https');
// const fs = require('fs');

// const https_options = {
//     cert: fs.readFileSync("babu.crt"),
//     key: fs.readFileSync("babu-privateKey.key"),
//   };

// const app = express();
// const PORT = process.env.PORT || 5000;
// const HOST = '172.21.32.1'
// // Middleware
// app.use(express.json());
// app.use(cors({
//   origin: ['https://172.21.32.1:5173','http://localhost:5173','http://172.21.32.1:5000','https://697d-2405-9800-bcb1-8817-f431-33c6-d672-b6de.ngrok-free.app'],
//   credentials:true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
// }));

// // Set up storage for images
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Directory to save images
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// // Initialize multer
// const upload = multer({ storage });

// // MongoDB connection
// mongoose.connect('mongodb://localhost:27017/auth-demo', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));

// // User registration route
// app.post('/register', upload.single('image'), async (req, res) => {
//     const { username, password } = req.body;
//     const imagePath = req.file ? req.file.path : null; // Get image path
  
//     console.log("Image Path:", imagePath);  // Log the image path
  
//     try {
//       const userExists = await User.findOne({ username });
//       if (userExists) return res.status(400).json({ message: 'User already exists' });
  
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const newUser = new User({ username, password: hashedPassword, image: imagePath });
//       await newUser.save();
      
//       res.status(201).json({ message: 'User registered successfully', user: newUser });
//     } catch (error) {
//       console.error('Error in register route:', error);  // Log the error
//       res.status(500).json({ message: 'Server error' });
//     }
//   });
// app.post('/api/login', async (req, res) => {
//     console.log('Request Body:', req.body);
//   const { username, password } = req.body;
//   if (!username || !password) {
//     return res.status(400).json({ message: 'Username and password are required' });
//   }
//   try {
//     const user = await User.findOne({ username });
//     if (!user) return res.status(400).json({ message: 'Invalid credentials' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

//     const token = jwt.sign({ id: user._id }, 'jwtSecret', { expiresIn: '1h' });
//     res.json({ token, user: { id: user._id, username: user.username } });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });
// app.get('/api/profile/:id', async (req, res) => {
//     try {
//       const user = await User.findById(req.params.id);
//       if (!user) return res.status(404).json({ message: 'User not found' });
  
//       console.log("Fetched User:", user);  // Log user details to check
//       res.json({
//         username: user.username,
//         image: user.image,  // Send back the image path
//       });
//     } catch (error) {
//       console.error('Error fetching profile:', error);  // Log any error
//       res.status(500).json({ message: 'Server error' });
//     }
// });

// // Static file serving
// app.use('/uploads', express.static('uploads'));
// // server.listen(PORT,HOST,() => {console.log(`Server running on port${HOST}:${PORT}`)});
// const server = https.createServer(https_options, (req, res) => {
//     const clientIp = req.socket.remoteAddress; // Get the client's IP address
//     console.log(`Client IP: ${clientIp}`);

//     // Handle your routes here, for example:
//     res.writeHead(200, {'Content-Type': 'text/plain'});
//     res.end('Hello, world!\n');
// });

// // Start the server
// server.listen(PORT, HOST, () => {
//     console.log(`Hello IREALLYHOST listening on port ${HOST}:${PORT}`);
// });


//__________________________________________________________________________

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const User = require('./Models/User');  // Import User model
const https = require('https');
const fs = require('fs');
const os = require('os');
const bodyParser = require('body-parser');
require('dotenv').config();
const helmet = require('helmet');
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (let iface in interfaces) {
    for (let i = 0; i < interfaces[iface].length; i++) {
      let address = interfaces[iface][i];
      if (address.family === 'IPv4' && !address.internal) {
        return address.address;
      }
    }
  }
  return '127.0.0.1';
}
// const localIP = getLocalIP();
const localIP = "192.168.1.194"
// HTTPS options for the server
// const https_options = {
//     cert: fs.readFileSync("mytestsite.crt"),
//     key: fs.readFileSync("mytestsite.key"),
// };
const PORT = process.env.PORT || 5000;
const app = express();
app.use(helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'", "https://cdn.ngrok.com"],
        "style-src": ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"],
        "font-src": ["'self'", "https://fonts.gstatic.com"],
        "script-src": ["'self'", "'unsafe-eval'", "'unsafe-inline'"]
      }
    }
  }));
// Middleware
app.use(express.json());
app.use(cors({
    // origin: [`${localIP}:5173`,'https://169.254.221.159:5173','https://192.168.1.194'],
    // origin: 'https://localhost',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
}));
app.use(express.static('public'));

// Set up storage for images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Initialize multer
const upload = multer({ storage });

// MongoDB connection
// mongoose.connect('mongodb://localhost:27017/auth-demo', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// User registration route
app.post('/register', upload.single('image'), async (req, res) => {
    const { username, password } = req.body;
    const imagePath = req.file ? req.file.filename : null; // Store only the filename
    
    console.log("Image Path:", imagePath);  // Log the image path

    try {
        const userExists = await User.findOne({ username });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, image: imagePath });
        await newUser.save();
      
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error in register route:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login route

const { body, validationResult } = require('express-validator');

// app.post('/register', upload.single('image'), [
//     body('username')
//         .isString().withMessage('Username must be a string.')
//         .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long.'),
//     body('password')
//         .isString().withMessage('Password must be a string.')
//         .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
// ], async (req, res) => {
//     console.log("Received request body:", req.body); // Debugging output
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }
    
//     // Continue with registration logic...
// });

app.post('/login', async (req, res) => {
    console.log('Request Body:', req.body);
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Find user in the database
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, 'jwtSecret', { expiresIn: '1h' });

        // Get just the filename from the image URL
        const filename = path.basename(user.image); // Extract filename

        // Respond with token and user data
        res.json({ 
            token, 
            user: { 
                id: user._id, 
                username: user.username, 
                img_url: filename // Use the filename instead of the full path
            } 
        });

        // Log user information
        console.log(filename, user.username, user._id);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Server error' });
    }
});


// app.post('/login', async (req, res) => {
//     console.log('Request Body:', req.body);
//     const { username, password } = req.body;
//     if (!username || !password) {
//         return res.status(400).json({ message: 'Username and password are required' });
//     }
//     try {
//         const user = await User.findOne({ username });
//         if (!user) return res.status(400).json({ message: 'Invalid credentials' });

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

//         const token = jwt.sign({ id: user._id }, 'jwtSecret', { expiresIn: '1h' });
//         res.json({ token, user: { id: user._id, username: user.username,img_url:user.image } });
//         console.log(user.image,user.username,user._id)
//     } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//     }
// });
app.get('/api/ip', (req, res) => {
    const localIP = getLocalIP();
    res.json({ ip: `${localIP}:${PORT}` });
  });

  app.get('/lan-ip', (req, res) => {
    res.json({ localIP });
  });
// Profile route
app.get('/profile/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        console.log("Fetched User:", user);  // Log user details to check
        res.json({
            username: user.username,
            image: user.image.filename,  // Send back the image path
        });
    } catch (error) {
        console.error('Error fetching profile:', error);  // Log any error
        res.status(500).json({ message: 'Server error' });
    }
});
app.get('/userdata', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from header
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, 'jwtSecret'); // Verify token
        const userId = decoded.id; // Get user ID from the token

        const userData = await User.findById(userId); 
        if (!userData) return res.status(404).json({ message: 'User not found' });

        res.json({
            username: userData.username,
            image: userData.image,
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// app.get('/profile/:id', async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id).select('-password'); // Exclude password from the response
//         if (!user) return res.status(404).json({ message: 'User not found' });

//         res.json({
//             username: user.username,
//             image: user.image, // Return the image filename or path as needed
//         });
//     } catch (error) {
//         console.error('Error fetching profile:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// Static file serving
// app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Create HTTPS server with Express app

// const server = https.createServer(https_options, app);

// Start the server
app.listen(PORT, localIP, () => {
    console.log(`Server running on http://${localIP}:${PORT}`);
});

// curl -k -X POST https://172.21.32.1:5000/register \
// -H "Content-Type: application/json" \
// -d '{"username": "tt", "password": "321"}'
