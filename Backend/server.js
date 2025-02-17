import express from "express";
import bodyParser from "body-parser"
import { spawn } from "child_process";
import cors from "cors"

const app = express();

const PORT = 3000;

app.use(cors())

app.use(bodyParser.json());

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