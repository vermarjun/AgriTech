import os
import sys
import json
import logging
import google.generativeai as genai

# Suppress all logs
logging.basicConfig(level=logging.CRITICAL)

# Configure the API key using environment variable
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# Create the model with configuration
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    generation_config=generation_config,
    system_instruction="You are an AI assistant. Respond helpfully.",
)

def chat_with_gemini(data):
    user_input = f"This is the live data of my garden soil based on that answer the questions asked below? Data : {data}"
    try:
        chat_session = model.start_chat(history=[])
        response = chat_session.send_message(user_input)
        return response.text.strip()
    except Exception as e:
        return json.dumps({"error": str(e)})

def main():
    try:
        # Read input from stdin
        input_data = sys.stdin.read()
        data = json.loads(input_data).get("text", "")

        if not data:
            print(json.dumps({"error": "No input data provided"}))
            sys.stdout.flush()
            return

        bot_response = chat_with_gemini(data)

        # Return JSON response
        print(json.dumps({"response": bot_response}))
        sys.stdout.flush()

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.stdout.flush()

if __name__ == "__main__":
    main()