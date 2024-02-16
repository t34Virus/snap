const express = require('express');
const multer = require('multer');
const http = require('http');
const { Server } = require("socket.io");

const path = require('path');
const app = express();
const port = process.env.PORT || 3001;
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", // Allows connections from any origin
        methods: ["GET", "POST"],
        credentials: false
    }
});
  
const cors = require('cors');

require('dotenv').config();

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(process.env.REACT_APP_COMFYUI_INPUT_PATH));
    },
    filename: function (req, file, cb) {
      // cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
      cb(null, "example1.jpg");
    }
  });

const upload = multer({ storage: storage });

app.use(cors({
    origin: "*", // Allows requests from any origin
    credentials: false // Allows cookies and credentials to be sent along with requests
}));
  
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.post('/upload', upload.single('image'), (req, res) => {
res.json({ message: 'Successfully uploaded' });
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('capture', () => {
      io.emit('capture');
    });

    socket.on('retake', () => {
      io.emit('retake');
    });

    socket.on('viewerConnected', () => {
      console.log('viewerConnected')
      io.emit('viewerConnected');
    })

    socket.on('controllerConnected', () => {
      console.log('controllerConnected')
      io.emit('controllerConnected');
    })

    socket.on('countdown', () => {
      console.log('countdown')
      io.emit('countdown');
    })

    socket.on('imageUploaded', (imageData) => {
      console.log('new image received!')
      io.emit('newImage', imageData);
    });
});

server.listen(port, () => {
  console.log(`Backend server listening at ${process.env.REACT_APP_SERVER_IP}:${port}`);
});
