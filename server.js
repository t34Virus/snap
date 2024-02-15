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
        credentials: true
    }
});
  
const cors = require('cors');

require('dotenv').config();

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join('C:/Users/TROJAN/Projects/work/ComfyUI_windows_portable_nvidia_cu121_or_cpu/ComfyUI_windows_portable/ComfyUI/input'));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  

const upload = multer({ storage: storage });

app.use(cors({
    origin: "*", // Allows requests from any origin
    credentials: true // Allows cookies and credentials to be sent along with requests
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
    socket.on('urmom', () => {
        console.log('ur mom');
    });

    socket.on('imageUploaded', (imageData) => {
      console.log('new image received!', imageData)
      io.emit('newImage', imageData);
    });
  });

server.listen(port, () => {
  console.log(`Backend server listening at ${process.env.REACT_APP_SERVER_IP}:${port}`);
});
