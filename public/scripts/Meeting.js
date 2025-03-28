// let mediaRecorder;
// let audioChunks = [];
// const username = "uniqueUser123"; // Replace dynamically if needed

// document.getElementById("start").addEventListener("click", async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     mediaRecorder = new MediaRecorder(stream);

//     mediaRecorder.ondataavailable = event => {
//         audioChunks.push(event.data);
//     };

//     mediaRecorder.onstop = async () => {
//         const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//         const formData = new FormData();
//         formData.append("audio", audioBlob, "recording.wav");
//         formData.append("username", username);

//         await fetch("http://localhost:3000/upload", {
//             method: "POST",
//             body: formData
//         });

//         alert("Audio uploaded successfully!");
//     };

//     audioChunks = [];
//     mediaRecorder.start();

//     document.getElementById("start").disabled = true;
//     document.getElementById("stop").disabled = false;
// });

// document.getElementById("stop").addEventListener("click", () => {
//     mediaRecorder.stop();
//     document.getElementById("start").disabled = false;
//     document.getElementById("stop").disabled = true;
// });
// console.log("hit hua hai");
// const domain = "meet.jit.si";
// const options = {
//     roomName: "<%= roomId %>",
//     width: "100%",
//     height: "100%",
//     parentNode: document.getElementById("jitsi-container"),
//     configOverwrite: { startWithAudioMuted: false, startWithVideoMuted: false },
//     userInfo: { displayName: "<%= username %>" },
// };
// const api = new JitsiMeetExternalAPI(domain, options);
// let mediaRecorder;
// let audioChunks = [];

// // ✅ Backend se bheje gaye username & roomId ko frontend me use karna
// const username = "<%= username %>"; // EJS se username lena
// const roomId = "<%= roomId %>"; // EJS se roomId lena

// document.getElementById("start").addEventListener("click", async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     mediaRecorder = new MediaRecorder(stream);

//     mediaRecorder.ondataavailable = event => {
//         audioChunks.push(event.data);
//     };

//     mediaRecorder.onstop = async () => {
//         const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });

//         // ✅ Get filename from input box
//         let fileName = document.getElementById("filename").value.trim();
//         if (!fileName) {
//             fileName = `recording_${username}_${roomId}_${Date.now()}.wav`; // Default name
//         } else {
//             fileName += ".wav"; // Ensure .wav extension
//         }

//         const formData = new FormData();
//         formData.append("audio", audioBlob, fileName);
//         formData.append("username", username);
//         formData.append("roomId", roomId);

//         await fetch("http://localhost:3000/upload", {
//             method: "POST",
//             body: formData
//         });

//         alert("Audio uploaded successfully!");
//     };

//     audioChunks = [];
//     mediaRecorder.start();

//     document.getElementById("start").disabled = true;
//     document.getElementById("stop").disabled = false;
// });

// document.getElementById("stop").addEventListener("click", () => {
//     mediaRecorder.stop();
//     document.getElementById("start").disabled = false;
//     document.getElementById("stop").disabled = true;
// });