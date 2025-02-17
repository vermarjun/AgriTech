import os
import sys
import json
from groq import Groq
from gtts import gTTS
from langdetect import detect

GROQ_API_KEY = "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"
client = Groq(api_key=GROQ_API_KEY)


def chat_with_groq(user_input, lang):
    user_input = user_input + f"Please Reply only in this language: {lang}"
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": user_input}],
            temperature=1,
            max_completion_tokens=1024,
            top_p=1,
            stream=True,
            stop=None
        )

        response = ""
        for chunk in completion:
            response += chunk.choices[0].delta.content or ""

        return response.strip()
    except Exception as e:
        return f"Error in fetching response: {e}"


def main():
    try:
        # Read input from command line or JSON stdin
        if len(sys.argv) > 2:
            user_input = sys.argv[1]
            lang = sys.argv[2]
        else:
            input_data = json.load(sys.stdin)
            user_input = input_data.get("text", "")
            lang = input_data.get("lang", "auto")

        # Detect language if auto is provided
        if lang == "auto":
            try:
                lang = detect(user_input)
            except:
                lang = "hi"

        bot_response = chat_with_groq(user_input, lang)

        # Return JSON response
        print(json.dumps({"response": bot_response, "lang": lang}))
        sys.stdout.flush()

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.stdout.flush()


if __name__ == "__main__":
    main()
