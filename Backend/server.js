import express from "express";
import bodyParser from "body-parser"
import { spawn } from "child_process";
import cors from "cors"
import axios from "axios"

const app = express();

const PORT = 3000;

app.use(cors())

const YOUTUBE_API_KEY = "AIzaSyDuOy5pQik52L3QyBaDYhBu-FXj7UtWY_w";  
const BASE_URL = "https://www.googleapis.com/youtube/v3/search";

app.use(bodyParser.json());

app.get("/", ()=>{return "working"})

function getBotResponse(text, lang = "auto") {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn("python3", ["chatbot.py"]);

        pythonProcess.stdin.write(JSON.stringify({ text, lang }) + "\n");
        pythonProcess.stdin.end();

        let responseData = "";

        pythonProcess.stdout.on("data", (data) => {
            responseData += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
            console.error("Python Error:", data.toString());
        });

        pythonProcess.on("close", (code) => {
            try {
                const result = JSON.parse(responseData);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    });
}

app.get('/search', async (req, res) => {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query parameter is required" });

    try {
        const response = await axios.get(BASE_URL, {
            params: {
                part: "snippet",
                maxResults: 10,
                q: query,
                type: "video",
                key: YOUTUBE_API_KEY
            }
        });

        const videos = response.data.items.map(video => ({
            title: video.snippet.title,
            thumbnail: video.snippet.thumbnails.medium.url,
            videoUrl: `https://www.youtube.com/watch?v=${video.id.videoId}`
        }));
        res.json(videos);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch videos", details: error.message });
    }
});


app.post("/chatbot", async (req, res)=>{
    const mess = req.body.message.text;
    const lang = req.body.language.name;
    const ans = await getBotResponse(mess, lang);
    console.log(ans)
    return res.json({
        message: ans
    })
})

app.listen(PORT, ()=>{
    console.log("Running!");
})