const express = require("express");
const app = express();
const path = require("path");
const connectDB = require('./config/connectDB');
const User = require('./models/User');
const verifyToken = require('./middlewares/auth');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const Meeting = require("./models/Meeting");
// for uploading files start
// const upload = multer({ dest: "uploads/" });



// for uploading files end

app.use(require("cors")())
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// using dotenv middleware
require('dotenv').config();
app.use(express.json()); // To parse JSON data
app.use(express.urlencoded({ extended: true })); // To parse form data
// Public folder ko static files ke liye set karna
app.use(express.static(path.join(__dirname, "public")));

const SECRET_KEY = process.env.SECRET_KEY;
const API_KEY = process.env.API_KEY;
// console.log(API_KEY);
// Database connection
connectDB();

app.get("/", (req, res) => {
    res.render("Home");
});
// login page request here \

app.get("/login", (req, res) => {
    res.render("Login");
});
// sign up request here \
app.get("/signup", (req, res) => {
    res.render("Signup");
});
// main sign up logic here 
app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    // console.log(username, email, password);
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, meetings: [] });
        await newUser.save();
        res.status(201).redirect('/login');
    } catch (err) {
        res.status(400).json({ error: "User already exists!" });
        console.log(err);
    }
});
// main login logic here 
// Login Route
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: "User not found!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials!" });

        const token = jwt.sign(
            { id: user._id, username: user.username, email: user.email },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        // Token ko cookie me set karna
        res.cookie("token", token, { httpOnly: true, maxAge: 3600000 }); // 1 hour

        // Redirecting to dashboard.ejs after login
        res.redirect("/dashboard");
    } catch (err) {
        res.status(500).json({ error: "Server error" });
        console.log(err);
    }
});
// get request for the dashboard 
app.get("/dashboard", verifyToken, async (req, res) => {
    try {
        const user = req.user;
        if (!user) return res.status(404).send("User not found");

        res.render("dashboard", { user });
    } catch (error) {
        res.status(500).send("Server error");
    }
});
// create meeting request 
app.post("/createmeeting", verifyToken, (req, res) => {
    const { topic } = req.body;
    console.log(topic);
    const meetingId = uuidv4();
    res.redirect(`/meeting/${meetingId}/${topic}`);
});
// join meeting 
app.post('/joinmeeting', (req, res) => {
    const { roomcode } = req.body;
    console.log(roomcode);
    res.redirect(`/meeting/${roomcode}`);
})
// Meeting Room Page
app.get("/meeting/:roomId", verifyToken, (req, res) => {
    const topic = req.query.topic || "No Topic";
    res.render("meeting", {
        roomId: req.params.roomId,
        username: req.user.username,
        topic: topic,
    });
});
app.get("/meeting/:roomId/:topic", verifyToken, (req, res) => {
    res.render("meeting", {
        roomId: req.params.roomId,
        username: req.user.username,
        topic: req.params.topic,
    });
});
// =======================================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        console.log("Received filename:", req.body.filename); // Debugging ke liye
        cb(null, req.body.filename || file.originalname);
    }
});

const upload = multer({ storage: storage });

// app.post("/upload", upload.single("audio"), (req, res) => {
//     console.log("File received:", req.file);

//     if (!req.file) {
//         return res.status(400).send("No file uploaded.");
//     }

//     res.status(200).json({ message: "Upload successful" });
// });
// handling the transcription request here 
const textFilePath = path.join(__dirname, "text.json");
const uploadDir = path.join(__dirname, "uploads");
// kaam shuru 
// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
const storage1 = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${timestamp}.wav`;
        cb(null, filename);
    }
});
// pp.post("/upload", upload.single("audio"), (req, res) => {
//     res.json({ message: "File uploaded successfully", filename: req.file.filename });
// });
// const upload = multer({ storage: storage });

// async function transcribeAudio(filePath) {
//     try {
//         const uploadResponse = await axios.post(
//             "https://api.assemblyai.com/v2/uploads",
//             fs.createReadStream(filePath),
//             { headers: { authorization: API_KEY } }
//         );

//         const audioUrl = uploadResponse.data.upload_url;

//         const transcriptResponse = await axios.post(
//             "https://api.assemblyai.com/v2/transcript",
//             { audio_url: audioUrl },
//             { headers: { authorization: API_KEY } }
//         );

//         const transcriptId = transcriptResponse.data.id;

//         while (true) {
//             await new Promise(resolve => setTimeout(resolve, 3000));

//             const response = await axios.get(
//                 `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
//                 { headers: { authorization: API_KEY } }
//             );

//             if (response.data.status === "completed") {
//                 return response.data.text;
//             } else if (response.data.status === "failed") {
//                 return "Transcription failed.";
//             }

//             console.log(`Processing ${path.basename(filePath)}...`);
//         }
//     } catch (error) {
//         console.error("Error:", error.response ? error.response.data : error.message);
//         return "Error transcribing file.";
//     }
// }

// // Function to transcribe all audio files in uploads folder
// async function transcribeAllFiles() {
//     if (!fs.existsSync(textFilePath)) {
//         fs.writeFileSync(textFilePath, JSON.stringify([]));
//     }

//     const files = fs.readdirSync(uploadDir).filter(file => file.endsWith(".wav"));
//     console.log(files);
//     let transcriptions = [];

//     for (let file of files) {
//         const filePath = path.join(uploadDir, file);
//         console.log(`Transcribing ${file}...`);

//         const text = await transcribeAudio(filePath);
//         transcriptions.push({ filename: file, transcription: text });
//     }

//     fs.writeFileSync(textFilePath, JSON.stringify(transcriptions, null, 2));
//     console.log("All transcriptions saved to text.json");
// }

// // Endpoint to trigger transcription
// app.get("/transcribe", async (req, res) => {
//     await transcribeAllFiles();
//     res.json({ message: "Transcription completed. Check text.json" });
// });
const upload1 = multer({ storage: storage1 });

// Upload endpoint
app.post("/upload", upload.single("audio"), (req, res) => {
    res.json({ message: "File uploaded successfully", filename: req.file.filename });
});

// Function to get transcription for a single file
async function transcribeAudio(filePath) {
    try {
        const uploadResponse = await axios.post(
            "https://api.assemblyai.com/v2/upload",
            fs.createReadStream(filePath),
            { headers: { authorization: API_KEY } }
        );

        const audioUrl = uploadResponse.data.upload_url;

        const transcriptResponse = await axios.post(
            "https://api.assemblyai.com/v2/transcript",
            { audio_url: audioUrl },
            { headers: { authorization: API_KEY } }
        );

        const transcriptId = transcriptResponse.data.id;

        while (true) {
            await new Promise(resolve => setTimeout(resolve, 3000));

            const response = await axios.get(
                `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
                { headers: { authorization: API_KEY } }
            );

            if (response.data.status === "completed") {
                return response.data.text;
            } else if (response.data.status === "failed") {
                return "Transcription failed.";
            }

            console.log(`Processing ${path.basename(filePath)}...`);
        }
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        return "Error transcribing file.";
    }
}

// Function to transcribe all audio files in uploads folder
async function transcribeAllFiles() {
    if (!fs.existsSync(textFilePath)) {
        fs.writeFileSync(textFilePath, JSON.stringify([]));
    }
    console.log("hello sab thik hai");
    const files = fs.readdirSync(uploadDir).filter(file => file.endsWith(".wav"));
    let transcriptions = [];

    for (let file of files) {
        const filePath = path.join(uploadDir, file);
        console.log(`Transcribing ${file}...`);

        const text = await transcribeAudio(filePath);
        transcriptions.push({ filename: file, transcription: text });
    }

    fs.writeFileSync(textFilePath, JSON.stringify(transcriptions, null, 2));
    console.log("All transcriptions saved to text.json");
}

// Endpoint to trigger transcription
app.get("/transcribe", async (req, res) => {
    await transcribeAllFiles();
    res.json({ message: "Transcription completed. Check text.json" });
});
// // kaam end 
// Register page request here \
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
