import React, { useState, useEffect } from 'react';
import { 
    Home, 
    Settings, 
    BarChart, 
  Users, 
  HelpCircle,
  Leaf,
  Calendar,
  FileText,
  Sprout, Droplet, Thermometer
} from 'lucide-react';
import axios from 'axios';
import { API_URL } from '@/App';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  key: string;
}

const WeatherCard = ({ city = "Delhi", apiKey = "67dd4d98dc8b5443cd339efb6cc6a717" }) => {
  const [weather, setWeather] = useState({
    temp: 0,
    condition: '',
    location: '',
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
           `https://api.openweathermap.org/data/2.5/weather?lat=28.65195&lon=77.23149&appid=${apiKey}`
        );
        
        if (!response.ok) {
          throw new Error('Weather data not available');
        }
        
        const data = await response.json();
        
        setWeather({
          temp: Math.round(data.main.temp),
          condition: data.weather[0].main,
          location: data.name,
          loading: false,
          error: null
        });
      } catch (error) {
        setWeather({
          ...weather,
          loading: false,
          // @ts-ignore
          error: error.message
        });
      }
    };

    fetchWeather();
  }, [city, apiKey]);
  // @ts-ignore
  const getStatusColor = (condition) => {
    const conditions = {
      'Clear': 'text-yellow-400 bg-yellow-400',
      'Clouds': 'text-blue-300 bg-blue-300',
      'Rain': 'text-blue-500 bg-blue-500',
      'Snow': 'text-blue-100 bg-blue-100',
      'Thunderstorm': 'text-purple-500 bg-purple-500',
      'Drizzle': 'text-blue-400 bg-blue-400',
      'Mist': 'text-gray-400 bg-gray-400',
      'Fog': 'text-gray-400 bg-gray-400'
    };
    // @ts-ignore
    return conditions[condition] || 'text-gray-500 bg-gray-500';
  };

  if (weather.loading) {
    return (
      <div className="bg-black bg-opacity-40 backdrop-blur-lg border border-blue-950 shadow-lg rounded-2xl p-6">
        <div className="flex flex-col items-center">
          <div className="text-xl mb-1">Loading...</div>
        </div>
      </div>
    );
  }

  if (weather.error) {
    return (
      <div className="bg-black bg-opacity-40 backdrop-blur-lg border border-red-950 shadow-lg rounded-2xl p-6">
        <div className="flex flex-col items-center">
          <div className="text-xl mb-1">Error</div>
          <div className="text-sm text-red-500">{weather.error}</div>
        </div>
      </div>
    );
  }

  const statusColor = getStatusColor(weather.condition);
  return (
      <div className="bg-black bg-opacity-40 backdrop-blur-lg border border-blue-950 shadow-lg rounded-2xl p-6">
      <div className="flex flex-col items-center">
        <div className="text-xl mb-1">{weather.location}</div>
        <div className="text-5xl font-bold mb-2">{weather.temp - 273}°C</div>
        <span className={`${statusColor.split(' ')[0]} ${statusColor.split(' ')[1]} bg-opacity-20 px-3 py-1 rounded-full text-sm`}>
          {weather.condition}
        </span>
      </div>
    </div>
  );
};


function DashBoardContent() {
  // State for soil metrics
  const [N, setN] = useState(0);
  const [P, setP] = useState(0);
  const [K, setK] = useState(0);
  const [humidity, setHumidity] = useState(28);
  const [temperature, setTemperature] = useState(20);
  const [moisture, setMoisture] = useState(0);
  
  // State for advice and recommendations
  const [aiAdvice, setAIAdvice] = useState("Loading AI advice...");
  const [suitableCrops, setSuitableCrops] = useState([]);
  const [isLoadingCrops, setIsLoadingCrops] = useState(true);
  
  // State for crop yield prediction
  const [cropName, setCropName] = useState("");
  const [expectedYield, setExpectedYield] = useState(null);
  const [isLoadingYield, setIsLoadingYield] = useState(false);

  // Fetch data from ThingSpeak and get AI advice
  useEffect(() => {
    const fetchSoilData = async () => {
      try {
        // Fetch data from ThingSpeak
        const response = await axios.get('https://api.thingspeak.com/channels/2826247/feeds.json?results=2');
        const latestData = response.data.feeds[0];
        
        // Update state with ThingSpeak data
        setN(parseFloat(latestData.field5) || 0);
        setP(parseFloat(latestData.field6) || 0);
        setK(parseFloat(latestData.field7) || 0);
        setHumidity(parseFloat(latestData.field2) || 28);
        setMoisture(parseFloat(latestData.field1) || 0);
        setTemperature(parseFloat(latestData.field3) || 20);
        
        // Get AI advice
        await getAIAdvice(
          parseFloat(latestData.field1) || 0,
          parseFloat(latestData.field2) || 0,
          parseFloat(latestData.field3) || 0,
          parseFloat(latestData.field4) || 28,
          parseFloat(latestData.field5) || 0
        );
      } catch (error) {
        console.error('Error fetching data:', error);
        setAIAdvice("Failed to load soil data. Please try again later.");
      }
    };

    fetchSoilData();
  }, []);

  // Get AI advice and then fetch suitable crops
//   @ts-ignore
const getAIAdvice = async (n, p, k, hum, moist) => {
  try {
    // Request AI advice
    const { data } = await axios.post(`${API_URL}/aiadvice`, {
      nitrogen: n,
      phosphorus: p,
      potassium: k,
      humidity: hum,
      moisture: moist,
      temperature: temperature
    });

    if (!data.advice) {
      setAIAdvice("No advice available");
      return;
    }

    // Parse the AI advice into JSX elements
    const formattedAdvice = parseAIAdvice(data.advice);
    setAIAdvice(formattedAdvice);

    // Fetch suitable crops
    getSuitableCrops(n, p, k, hum, moist);
  } catch (error) {
    console.error("Error getting AI advice:", error);
    setAIAdvice("Failed to get AI advice. Please try again later.");
    setIsLoadingCrops(false);
  }
};

// Function to parse AI advice text into JSX elements
const parseAIAdvice = (advice) => {
  return advice.split("\n").map((line, index) => {
    if (line.startsWith("**")) {
      return <strong key={index}>{line.replace(/\*\*/g, "")}</strong>;
    } else if (line.startsWith("*")) {
      return <li key={index}>{line.replace(/\*/g, "")}</li>;
    } else if (/^\d+\./.test(line)) {
      return <p key={index}><strong>{line}</strong></p>;
    }
    return <p key={index}>{line}</p>;
  });
};

// Function to format AI advice into structured HTML
// @ts-ignore
const formatAIAdvice = (advice) => {
  return advice
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold text
    .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic text
    .replace(/(\d+\.)\s/g, "<br><strong>$1</strong> "); // Numbered list
};
  // Get suitable crops
//   @ts-ignore
  const getSuitableCrops = async (n, p, k, hum, moist) => {
    try {
      setIsLoadingCrops(true);
      const cropsResponse = await axios.post(`${API_URL}/bestcrop`, {
        nitrogen: n,
        phosphorus: p,
        potassium: k,
        humidity: hum,
        moisture: moist,
        temperature: temperature
      });
      
      setSuitableCrops(cropsResponse.data.crops || []);
    } catch (error) {
      console.error('Error getting suitable crops:', error);
      setSuitableCrops([]);
    } finally {
      setIsLoadingCrops(false);
    }
  };

  // Get expected crop yield
  const getExpectedYield = async () => {
    if (!cropName.trim()) {
      alert("Please enter a crop name");
      return;
    }
    
    try {
      setIsLoadingYield(true);
      const yieldResponse = await axios.post(`${API_URL}/cropyield`, {
        cropName: cropName,
        nitrogen: N,
        phosphorus: P,
        potassium: K,
        humidity: humidity,
        moisture: moisture,
        temperature: temperature
      });
      
      setExpectedYield(yieldResponse.data.yield || 0);
    } catch (error) {
      console.error('Error getting crop yield:', error);
      setExpectedYield(null);
    } finally {
      setIsLoadingYield(false);
    }
  };

  // Helper function to determine status label based on value
  //   @ts-ignore
  const getStatusLabel = (value, type) => {
    if (type === 'N') {
      if (value < 10) return { text: "Low", color: "text-red-500" };
      if (value < 20) return { text: "Moderate", color: "text-yellow-500" };
      return { text: "Healthy", color: "text-green-500" };
    }
    if (type === 'P') {
      if (value < 5) return { text: "Low", color: "text-red-500" };
      if (value < 15) return { text: "Moderate", color: "text-yellow-500" };
      return { text: "Healthy", color: "text-green-500" };
    }
    if (type === 'K') {
      if (value < 10) return { text: "Low", color: "text-red-500" };
      if (value < 20) return { text: "Moderate", color: "text-yellow-500" };
      return { text: "Excellent", color: "text-green-500" };
    }
    return { text: "Normal", color: "text-blue-500" };
  };

  const nStatus = getStatusLabel(N, 'N');
  const pStatus = getStatusLabel(P, 'P');
  const kStatus = getStatusLabel(K, 'K');

  return (
    <div className="flex-1 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-white">
        <div className="bg-black bg-opacity-40 backdrop-blur-lg border border-green-950 shadow-lg rounded-2xl p-6">
          <div className="flex flex-col items-center">
            <div className="text-xl mb-1">Nitrogen</div>
            <div className="text-5xl font-bold mb-2">{N}</div>
            <span className={`${nStatus.color} bg-opacity-20 px-3 py-1 rounded-full text-sm`}>
              {nStatus.text}
            </span>
          </div>
        </div>

        <div className="bg-black bg-opacity-40 backdrop-blur-lg border border-green-950 shadow-lg rounded-2xl p-6">
          <div className="flex flex-col items-center">
            <div className="text-xl mb-1">Phosphorus</div>
            <div className="text-5xl font-bold mb-2">{P}</div>
            <span className={`${pStatus.color} bg-opacity-20 px-3 py-1 rounded-full text-sm`}>
              {pStatus.text}
            </span>
          </div>
        </div>

        <div className="bg-black bg-opacity-40 backdrop-blur-lg border border-green-950 shadow-lg rounded-2xl p-6">
          <div className="flex flex-col items-center">
            <div className="text-xl mb-1">Potassium</div>
            <div className="text-5xl font-bold mb-2">{K}</div>
            <span className={`${kStatus.color} bg-opacity-20 px-3 py-1 rounded-full text-sm`}>
              {kStatus.text}
            </span>
          </div>
        </div>
      </div>

      {/* Additional metrics row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-white">
        <div className="bg-black bg-opacity-40 backdrop-blur-lg border border-green-950 shadow-lg rounded-2xl p-6">
          <div className="flex flex-col items-center">
            <div className="text-xl mb-1 flex items-center">
              <Droplet className="mr-2" size={20} />
              Humidity
            </div>
            <div className="text-5xl font-bold mb-2">{humidity}%</div>
          </div>
        </div>

        <div className="bg-black bg-opacity-40 backdrop-blur-lg border border-green-950 shadow-lg rounded-2xl p-6">
          <div className="flex flex-col items-center">
            <div className="text-xl mb-1 flex items-center">
              <Thermometer className="mr-2" size={20} />
              Temperature
            </div>
            <div className="text-5xl font-bold mb-2">{temperature}°C</div>
          </div>
        </div>

        <div className="bg-black bg-opacity-40 backdrop-blur-lg border border-green-950 shadow-lg rounded-2xl p-6">
          <div className="flex flex-col items-center">
            <div className="text-xl mb-1 flex items-center">
              <Droplet className="mr-2" size={20} />
              Soil Moisture
            </div>
            <div className="text-5xl font-bold mb-2">{moisture}%</div>
          </div>
        </div>
      </div>

      {/* AI Report */}
      <div className="bg-black bg-opacity-40 backdrop-blur-lg border border-green-950 shadow-lg rounded-2xl mb-6">
        <div className="p-4 border-b border-green-900">
          <h2 className="flex items-center text-green-400 text-xl font-bold">
            <BarChart className="mr-2" size={20} />
            AI Report
          </h2>
        </div>
        <div className="p-6 text-white">
          <p className="mb-4">{aiAdvice}</p>
        </div>
      </div>

      {/* Most Suitable Crop For Current Soil Conditions */}
      <div className="bg-black bg-opacity-40 backdrop-blur-lg border border-green-950 shadow-lg rounded-2xl mb-6">
        <div className="p-4 border-b border-green-900">
          <h2 className="flex items-center text-green-400 text-xl font-bold">
            <Sprout className="mr-2" size={20} />
            Most Suitable Crops For Current Soil Conditions
          </h2>
        </div>
        <div className="p-6 text-white">
          {isLoadingCrops ? (
            <p>Loading crop recommendations...</p>
          ) : suitableCrops.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {suitableCrops.map((crop, index) => (
                <div key={index} className="bg-green-900 bg-opacity-30 p-4 rounded-lg flex flex-col items-center">
                  <Sprout size={32} className="mb-2 text-green-400" />
                  <p className="text-center font-medium">{crop}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No suitable crops found for the current soil conditions.</p>
          )}
        </div>
      </div>
      
      {/* Expected Crop Yield For Given Soil Condition */}
      <div className="bg-black bg-opacity-40 backdrop-blur-lg border border-green-950 shadow-lg rounded-2xl mb-6">
        <div className="p-4 border-b border-green-900">
          <h2 className="flex items-center text-green-400 text-xl font-bold">
            <BarChart className="mr-2" size={20} />
            Expected Crop Yield For Given Soil Condition
          </h2>
        </div>
        <div className="p-6 text-white">
          <div className="flex items-center mb-4">
            <input 
              type="text" 
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              placeholder="Enter crop name"
              className="bg-green-900 bg-opacity-30 text-white placeholder-green-300 border border-green-700 rounded-l-lg p-2 flex-1"
            />
            <button 
              onClick={getExpectedYield}
              disabled={isLoadingYield}
              className="bg-green-600 hover:bg-green-700 text-white rounded-r-lg px-4 py-2"
            >
              {isLoadingYield ? "Loading..." : "Check Yield"}
            </button>
          </div>
          
          {expectedYield !== null && (
            <div className="bg-green-900 bg-opacity-30 p-6 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-2">Expected Yield</h3>
              <div className="text-5xl font-bold text-green-400 mb-2">
                {expectedYield}%
              </div>
              <p className="text-sm">
                {expectedYield >= 80 
                  ? "Excellent yield potential!" 
                  : expectedYield >= 60 
                  ? "Good yield potential." 
                  : expectedYield >= 40 
                  ? "Moderate yield potential." 
                  : "Low yield potential. Consider soil amendments."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const Dashboard: React.FC = () => {
  const [activeSidebarItem, setActiveSidebarItem] = useState<string>('dashboard');

  // Sidebar navigation items
  const sidebarItems: SidebarItem[] = [
    { icon: <Home size={20} />, label: 'Dashboard', key: 'dashboard' },
    { icon: <Home size={20} />, label: 'Most Suitable Crop', key: 'Most Suitable Crop' },
    { icon: <BarChart size={20} />, label: 'Expected Yield', key: 'Expected Yield' },
    { icon: <Leaf size={20} />, label: 'Detect Nutrient Leaching', key: 'Detect Nutrient Leaching' },
    { icon: <Calendar size={20} />, label: 'AgriAI', key: 'AgriAI' },
    { icon: <FileText size={20} />, label: 'Reports', key: 'reports' },
    { icon: <Users size={20} />, label: 'Users', key: 'users' },
    { icon: <Settings size={20} />, label: 'Settings', key: 'settings' },
    { icon: <HelpCircle size={20} />, label: 'Help', key: 'help' },
  ];

  return (
    <div className="min-h-screen bg-neutral-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-black bg-opacity-40 backdrop-blur-lg border-r border-green-950 text-white mt-20">
        <div className="py-4">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left ${
                activeSidebarItem === item.key
                  ? 'bg-green-900 bg-opacity-30 border-l-4 border-green-500'
                  : 'hover:bg-neutral-800'
              }`}
              onClick={() => setActiveSidebarItem(item.key)}
            >
              <span className={activeSidebarItem === item.key ? 'text-green-400' : ''}>
                {item.icon}
              </span>
              <span className={activeSidebarItem === item.key ? 'font-medium text-green-400' : ''}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col mt-20">
        {activeSidebarItem == "dashboard" && <DashBoardContent/> }
      </div>
    </div>
  );
};

export default Dashboard;