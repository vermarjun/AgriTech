import express from "express";
import bodyParser from "body-parser"
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import cors from "cors"
import axios from "axios"
import { join } from "path";
import { dirname } from "path";

const app = express();

// Environment variables
const YT_API_KEY = process.env.YT_API_KEY;
const THINGSPEAK_CHANNEL_ID = process.env.THINGSPEAK_CHANNEL_ID;
const THINGSPEAK_READ_API_KEY = process.env.THINGSPEAK_READ_API_KEY;

// API endpoints
const THINGSPEAK_URL = `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}/feeds.json`;
const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const YOUTUBE_VIDEO_DETAILS_URL = "https://www.googleapis.com/youtube/v3/videos";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = 3000;

app.use(cors())

app.use(bodyParser.json());

app.get("/", ()=>{return "working"})

async function fetchNPKFromThingSpeak() {
    try {
      const response = await axios.get(THINGSPEAK_URL, {
        params: {
          api_key: THINGSPEAK_READ_API_KEY,
          results: 1 // Get only the latest reading
        }
      });
  
      if (!response.data.feeds || response.data.feeds.length === 0) {
        throw new Error("No data available from ThingSpeak");
      }
  
      const latestReading = response.data.feeds[0];
      
      // Assuming field1 = nitrogen, field2 = phosphorus, field3 = potassium
      // Adjust these field mappings according to your ThingSpeak channel setup
      const npkValues = {
        nitrogen: parseFloat(latestReading.field1) || 0,
        phosphorus: parseFloat(latestReading.field2) || 0,
        potassium: parseFloat(latestReading.field3) || 0
      };
  
      console.log("Retrieved NPK values:", npkValues);
      return npkValues;
    } catch (error) {
      console.error("Error fetching data from ThingSpeak:", error.message);
      throw error;
    }
  }

  function analyzeSoil(npkValues) {
    const issues = [];
    
    // These thresholds should be adjusted based on your specific crop requirements
    if (npkValues.nitrogen < 50) {
      issues.push("low-nitrogen");
    } else if (npkValues.nitrogen > 200) {
      issues.push("high-nitrogen");
    }
    
    if (npkValues.phosphorus < 30) {
      issues.push("low-phosphorus");
    } else if (npkValues.phosphorus > 150) {
      issues.push("high-phosphorus");
    }
    
    if (npkValues.potassium < 40) {
      issues.push("low-potassium");
    } else if (npkValues.potassium > 180) {
      issues.push("high-potassium");
    }
    
    return issues;
  }

  function getSearchTerms(issues) {
    const searchTermMap = {
      "low-nitrogen": "कम नाइट्रोजन वाली मिट्टी को कैसे ठीक करें",
      "high-nitrogen": "अधिक नाइट्रोजन वाली मिट्टी को कैसे ठीक करें",
      "low-phosphorus": "कम फॉस्फोरस वाली मिट्टी को कैसे ठीक करें",
      "high-phosphorus": "अधिक फॉस्फोरस वाली मिट्टी को कैसे ठीक करें",
      "low-potassium": "कम पोटेशियम वाली मिट्टी को कैसे ठीक करें",
      "high-potassium": "अधिक पोटेशियम वाली मिट्टी को कैसे ठीक करें"
    };
    
    // If no specific issues found, return a general term
    if (issues.length === 0) {
      return ["मिट्टी की उर्वरता बढ़ाने के उपाय"];
    }
    
    return issues.map(issue => searchTermMap[issue] || "मिट्टी में NPK की कमी को कैसे दूर करें");
  }

  async function searchYouTubeVideos(searchTerm) {
    try {
      // First, search for videos
      const searchResponse = await axios.get(YOUTUBE_SEARCH_URL, {
        params: {
          part: "snippet",
          q: searchTerm,
          maxResults: 5,
          relevanceLanguage: "hi", // Hindi language
          regionCode: "IN",  // India region
          type: "video",
          key: YT_API_KEY
        }
      });
      
      if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
        return [];
      }
      
      // Get video IDs from search results
      const videoIds = searchResponse.data.items.map(item => item.id.videoId);
      
      // Get detailed information about the videos
      const detailsResponse = await axios.get(YOUTUBE_VIDEO_DETAILS_URL, {
        params: {
          part: "snippet,statistics",
          id: videoIds.join(","),
          key: YT_API_KEY
        }
      });
      
      if (!detailsResponse.data.items) {
        return [];
      }
      
      // Format the video data
      return detailsResponse.data.items.map(video => ({
        id: video.id,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.high.url,
        views: video.statistics.viewCount || "N/A",
        description: video.snippet.description
      }));
    } catch (error) {
      console.error(`Error searching YouTube for "${searchTerm}":`, error.message);
      return [];
    }
  }

  app.get("/handleFetchYt", async (req, res)=> {
    try {
      // If NPK values are provided in the query parameters, use those
      // Otherwise, fetch from ThingSpeak
      let npkValues;
      if (req.query.nitrogen && req.query.phosphorus && req.query.potassium) {
        npkValues = {
          nitrogen: parseFloat(req.query.nitrogen),
          phosphorus: parseFloat(req.query.phosphorus),
          potassium: parseFloat(req.query.potassium)
        };
      } else {
        npkValues = await fetchNPKFromThingSpeak();
      }
      
      // Analyze soil and determine issues
      const soilIssues = analyzeSoil(npkValues);
      
      // Get search terms based on soil issues
      const searchTerms = getSearchTerms(soilIssues);
      
      // Search YouTube for relevant videos
      let allVideos = [];
      for (const term of searchTerms) {
        const videos = await searchYouTubeVideos(term);
        allVideos = [...allVideos, ...videos];
      }
      
      // Remove duplicates and limit to top 9
      const uniqueVideos = allVideos
        .filter((video, index, self) => 
          index === self.findIndex(v => v.id === video.id)
        )
        .slice(0, 9);
      
      // Send response
      res.json({
        npkValues,
        soilIssues,
        searchTerms,
        videos: uniqueVideos
      });
    } catch (error) {
      console.error("Error in handleFetchYt:", error.message);
      res.status(500).json({
        error: "Failed to fetch data",
        message: error.message
      });
    }
  })
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
    console.log(mess, lang)
    const ans = await getBotResponse(mess, lang);
    console.log(ans)
    return res.json({
        message: ans
    })
})

// generate AI recommendations function
async function fetchAiRecommendations(text) {
    return new Promise((resolve, reject) => {
        // Path to the Python script
        const pythonScriptPath = join(__dirname, "AIDataAnalysis.py");

        // Spawn the Python process
        const pythonProcess = spawn("python3", [pythonScriptPath], {
            env: {
                ...process.env,
                GEMINI_API_KEY: "AIzaSyA11Yrjfu3NRWdR-9ZoIb-nrZay_q4JQ1g",
            },
        });

        // Send the input text to the Python process
        pythonProcess.stdin.write(JSON.stringify({ text }) + "\n");
        pythonProcess.stdin.end();

        let responseData = "";

        // Collect data from the Python process's stdout
        pythonProcess.stdout.on("data", (data) => {
            responseData += data.toString();
        });

        // Handle errors from the Python process's stderr
        let errorData = "";
        pythonProcess.stderr.on("data", (data) => {
            errorData += data.toString();
        });

        // Handle process closure
        pythonProcess.on("close", (code) => {
            if (code !== 0) {
                // If the process exits with a non-zero code, treat it as an error
                reject(new Error(`Python process exited with code ${code}. Error: ${errorData}`));
                return;
            }

            try {
                // Parse the response data as JSON
                const result = JSON.parse(responseData);
                resolve(result);
            } catch (error) {
                // If JSON parsing fails, treat it as an error
                reject(new Error(`Failed to parse Python output: ${error.message}. Output: ${responseData}`));
            }
        });
    });
}

app.post("/aiadvice", async (req, res)=>{
    const { nitrogen, phosphorus, potassium, humidity, moisture, temperature} = req.body;
    console.log(nitrogen, phosphorus, potassium)
    const data = `Nitrogen: ${nitrogen}, phosphorus: ${phosphorus}, potassium:${potassium}, humidity:${humidity}, moisture:${moisture}, temperature:${temperature}, suggest me what should be my appraoch towards soil? how should I manage my soil for better yeild? Answer should be in less than 100words`
    const ans = await fetchAiRecommendations(data);
    console.log(ans)
    let adviceString;
    if (Array.isArray(ans)) {
        adviceString = ans.map(obj => obj.response).join(" "); // If ans is an array
    } else {
        adviceString = ans.response; // If ans is a single object
    }
    console.log(adviceString)
    return res.json({"advice": adviceString});
})

app.post("/bestcrop", async (req, res) => {
    try {
        const { nitrogen, phosphorus, potassium, humidity, moisture, temperature } = req.body;

        // Validate input data (optional but recommended)
        if (!nitrogen || !phosphorus || !potassium || !humidity || !moisture || !temperature) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Prepare the data for the AI recommendation
        const data = `Nitrogen: ${nitrogen}, phosphorus: ${phosphorus}, potassium:${potassium}, humidity:${humidity}, moisture:${moisture}, temperature:${temperature}, Given this data give me a list of crops that are most suitable to be grown and will give the highest yield. In response, do not give anything else other than an array of crops that could be grown.`;

        // Fetch AI recommendations
        const ans = await fetchAiRecommendations(data);
        console.log(ans);

        // Parse the response and handle duplicates
        const cropsArray = JSON.parse(ans.response); // Parse the stringified JSON array
        const uniqueCrops = [...new Set(cropsArray)]; // Remove duplicates

        console.log(uniqueCrops);

        // Return the response
        return res.json({ "crops": uniqueCrops });
    } catch (error) {
        console.error("Error in /bestcrop endpoint:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/cropyield", async (req, res)=>{
    const { nitrogen, phosphorus, potassium, humidity, moisture, temperature, cropName} = req.body;
    const data = `This is my soil data: Nitrogen: ${nitrogen}, phosphorus: ${phosphorus}, potassium:${potassium}, humidity:${humidity}, moisture:${moisture}, temperature:${temperature}, I am sowing crop ${cropName}, based on this data give me an estimation of crop yield that I could expect. In response donot give anything other than A number of expected quantity of crops. assume the area to be acre, just give me an nummber that would be estimated yield per acre in response!!!!!.`
    const ans = await fetchAiRecommendations(data);
    console.log(ans)
    return res.json({"yield": ans.response});
})


app.listen(PORT, ()=>{
    console.log("Running!");
})