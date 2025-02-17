import { useState, useEffect } from "react";
import { FaPaperPlane, FaMicrophone, FaChevronDown } from "react-icons/fa";
import { Listbox } from '@headlessui/react';
import axios from "axios";

interface Language {
  id: number;
  name: string;
  code: string;
}

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

export default function ChatScreen() {
  const languages: Language[] = [
    { id: 1, name: 'English', code: 'en-US' },
    { id: 2, name: 'Hindi', code: 'hi-IN' },
    { id: 3, name: 'Telugu', code: 'te-IN' },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);
  const [chatHistory, setChatHistory] = useState<string[]>([
    "How does AI work?",
    "What is React?",
    "Explain Tailwind CSS.",
  ]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  //@ts-ignore
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // New state for loader
  
  const speakMessage = (text: string, languageCode: string) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = languageCode;
    window.speechSynthesis.speak(utterance);
  };
  
  async function fetchMessages(text:any, lang:any){
      const response = await axios.post("http://localhost:3000/chatbot", {
          message: text,
          language: lang
        })
        console.log(response)
        return response.data.message.response;
    }
    
    async function sendMessage() {
        if (input.trim() !== "") {
            const userMessage: Message = { text: input, sender: "user" };
            setMessages((prevMessages) => [...prevMessages, userMessage]);
            setInput("");
            
            // Simulate an AI response (for demonstration purposes)
      setIsLoading(true); // Show loader
      const response = await fetchMessages(userMessage, selectedLanguage);
      //@ts-ignore
        const aiMessage: Message = { text: response, sender: "ai" };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
        setIsLoading(false); // Hide loader
        speakMessage(aiMessage.text, selectedLanguage.code); // Speak out the AI response
        
        //   console.log("Message sent:", input);
    }
};

const startListening = (language: string = "en-US") => {
      //@ts-ignore
      const recognitionInstance = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognitionInstance.lang = language;
      recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.maxAlternatives = 1;
    
    //@ts-ignore
    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
    };
    
    //@ts-ignore
    recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error);
    };
    
    recognitionInstance.onend = () => {
        console.log("Speech recognition ended.");
    };
    
    recognitionInstance.start();
    setRecognition(recognitionInstance);
};

  const stopListening = async () => {
    if (recognition) {
        recognition.stop();
        console.log("Recording stopped.");
        sendMessage();
    } else {
        sendMessage();
    }
};

useEffect(() => {
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
}, [recognition]);

return (
    <div className="flex h-screen bg-black text-gray-300 max-w-screen">
      {/* Sidebar for Chat History */}
      <div className="relative w-1/4 bg-neutral-900 p-4 border-r border-gray-700">
        <h2 className="text-xl font-semibold mb-4 mt-20">Chat History</h2>
        <ul className="space-y-2">
          {chatHistory.map((chat, index) => (
            <li
              key={index}
              className="p-2 bg-gray-800 rounded cursor-pointer hover:bg-gray-700"
              >
              {chat}
            </li>
          ))}
        </ul>
        <div className="w-full bottom-10 absolute -ml-4 p-4">
          <button className="bg-blue-800 p-2 w-full rounded-lg hover:bg-blue-600">
            New Chat
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col justify-end p-6 mt-16">
        {/* Chat Messages */}
        <div className="w-full space-y-4 overflow-y-auto mb-4">
          {messages.map((message, index) => (
              <div
              key={index}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                    message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          {/* Loader for AI response */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[70%] p-3 rounded-lg bg-gray-700 text-gray-300">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce mr-2"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce mr-2"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Box */}
        <div className="w-full flex items-center bg-neutral-900 p-4 rounded-lg shadow-lg ">
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500"
            placeholder="Type your query..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />

          {/* Language Combobox */}
          <Listbox value={selectedLanguage} onChange={setSelectedLanguage}>
            <div className="relative ml-3">
              <Listbox.Button className="flex items-center text-gray-400 hover:text-white focus:outline-none">
                <span className="mr-2">{selectedLanguage.name}</span>
                <FaChevronDown size={12} />
              </Listbox.Button>
              <Listbox.Options className="absolute bottom-full mb-2 w-32 bg-neutral-800 border border-gray-700 rounded-lg shadow-lg focus:outline-none">
                {languages.map((language) => (
                  <Listbox.Option
                    key={language.id}
                    value={language}
                    className={({ active }) =>
                      `p-2 cursor-pointer ${
                        active ? 'bg-neutral-700 text-white' : 'text-gray-300'
                      }`
                    }
                  >
                    {language.name}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>

          {/* Mic Button */}
          <button
            onClick={() => startListening(selectedLanguage.code)}
            className="ml-3 text-gray-400 hover:text-white"
          >
            <FaMicrophone size={18} />
          </button>

          {/* Send Button */}
          <button
            onClick={stopListening}
            className="ml-3 text-gray-400 hover:text-white"
          >
            <FaPaperPlane size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}