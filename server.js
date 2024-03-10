const express = require('express');
const multer = require('multer');
const http = require('http');
const { Server } = require("socket.io");
const fs = require('fs');
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
app.use('/output', express.static(path.join(__dirname, '../output')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.post('/upload', upload.single('image'), (req, res) => {
res.json({ message: 'Successfully uploaded' });
});

const cmsFilePath = path.join(__dirname, 'src/common/cms.json');

function writeCMSFile(data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(cmsFilePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

const imagesDirectory = 'C:\\Users\\TROJAN\\Projects\\work\\react-webcam\\public\\images';

function getImages() {
  const fullPath = path.join(imagesDirectory);
  console.log(fullPath);
  fs.readdir(fullPath, (err, files) => {
    if (err) {
      console.log(err);
    }
    const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
    io.emit('imageList', images);
  });
}

app.post('/api/update', express.json(), async (req, res) => {
  try {
    const newData = req.body; // The new buttons data from the frontend
    await writeCMSFile(newData); // Write the new data to cms.json
    res.send('Data updated successfully');
  } catch (err) {
    console.error('Error writing file:', err);
    res.status(500).send('Error saving data');
  }
});

const outputDirectory = 'C:\\Users\\TROJAN\\Projects\\work\\react-webcam\\public\\output';

function emitOutputCompleted(imagePath) {
  fs.readFile(imagePath, (err, data) => {
      if (err) {
          console.error('Error reading image file:', err);
          return;
      }
      // Assuming the image data is emitted directly; might need to adjust based on actual requirements
      // On the server, after processing the image
      const base64Image = data.toString('base64');

        io.emit('output_completed', base64Image);
  });
}

fs.watch(outputDirectory, (eventType, filename) => {
  if (eventType === 'rename') {
      console.log('New file detected:', filename);
      const fullPath = path.join(outputDirectory, filename);
      // Check if the file exists to avoid errors when a file is removed
      if (fs.existsSync(fullPath)) {
          emitOutputCompleted(fullPath);
      }
  }
});

function deleteOutput() {
  fs.readdir(outputDirectory, (err, files) => {
    if (err) throw err;

    // Loop through and delete each file
    for (const file of files) {
      fs.unlink(path.join(outputDirectory, file), err => {
        if (err) throw err;
      });
    }
  });
}

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('capture', () => {
      io.emit('capture');
    });

    socket.on('confirm', () => {
      io.emit('confirm');
    });

    socket.on('retake', () => {
      deleteOutput();
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

    socket.on('cmsConnected', () => {
      console.log('cmsConnected')
      io.emit('cmsConnected');
    })

    socket.on('countdown', (prompt) => {
      console.log('countdown')
      deleteOutput();
      io.emit('countdown', prompt);
    })

    socket.on('imageUploaded', (imageData) => {
      console.log('new image received!')
      io.emit('newImage', imageData);
    });

    socket.on('getImages', () => {
      getImages();
    })
});

server.listen(port, () => {
  console.log(`Backend server listening at ${process.env.REACT_APP_SERVER_IP}:${port}`);
});

