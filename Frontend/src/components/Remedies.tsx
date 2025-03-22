  import React, { useState, useEffect } from 'react';
  import { ArrowRight, Leaf, ShoppingBag, RefreshCw, Youtube } from 'lucide-react';
  import { API_URL } from '@/App';
  import axios from "axios";

  // Define types for the NPK values
  interface NPKValues {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  }

  // Define types for the Gemini remedies
  interface Remedies {
    analysis: string;
    recommendations: string[];
    suggestedFertilizers: string[];
  }

  // Define types for YouTube videos
  interface Video {
    id: string;
    title: string;
    thumbnail: string;
    views: string;
  }

  // Define types for fertilizer options
  interface Fertilizer {
    id: number;
    name: string;
    npk: string;
    price: number;
    vendor: string;
    img: string;
  }

  // Define types for loading state
  interface LoadingState {
    npk: boolean;
    remedies: boolean;
    videos: boolean;
    fertilizers: boolean;
  }

  const NPKDashboard: React.FC = () => {
    // State for NPK values
    const [npkValues, setNpkValues] = useState<NPKValues>({ 
      nitrogen: 0, 
      phosphorus: 0, 
      potassium: 0 
    });
    
    // State for Gemini remedies
    const [remedies, setRemedies] = useState<Remedies | null>(null);
    
    // State for YouTube videos
    const [videos, setVideos] = useState<Video[]>([]);
    
    // State for fertilizer options
    const [fertilizers, setFertilizers] = useState<Fertilizer[]>([]);
    
    // State for loading status
    const [loading, setLoading] = useState<LoadingState>({
      npk: true,
      remedies: false,
      videos: false,
      fertilizers: false
    });

    // State for active tab
    const [activeTab, setActiveTab] = useState<string>("analysis");

    // Mock function to fetch NPK values from backend
    const fetchNPKValues = async (): Promise<void> => {
      setLoading(prev => ({ ...prev, npk: true }));
      
      // Simulate API call
      setTimeout(() => {
        // Mock data
        setNpkValues({
          nitrogen: 278,
          phosphorus: 22,
          potassium: 163
        });
        setLoading(prev => ({ ...prev, npk: false }));
      }, 1500);
    };

    // Mock function to fetch remedies from Gemini
    const fetchRemedies = async (): Promise<void> => {
      setLoading(prev => ({ ...prev, remedies: true }));
      
      // Simulate Gemini API call
      setTimeout(() => {
        // Mock Gemini response
        setRemedies({
          analysis: "Your soil shows high nitrogen, low phosphorus, and high potassium levels. This imbalance may affect plant growth and fruit development.",
          recommendations: [
            "Add a phosphorus-rich fertilizer to address the deficiency",
            "Reduce potassium application as levels are already high",
            "Maintain current nitrogen levels which are adequate"
          ],
          suggestedFertilizers: [
            "Triple Superphosphate (0-45-0)",
            "Bone Meal (3-15-0)",
            "Rock Phosphate (0-3-0)",
            "Fish Bone Meal (4-12-0)"
          ]
        });
        setLoading(prev => ({ ...prev, remedies: false }));
      }, 2000);
    };

    const fetchYouTubeVideos = async (): Promise<void> => {
      // Set loading state to true for videos
      setLoading(prev => ({ ...prev, videos: true }));
  
      try {
        // Send a GET request to the backend endpoint with NPK values as query parameters
        const response = await axios.get(`${API_URL}/handleFetchYt`, {
          params: {
            nitrogen: npkValues.nitrogen,
            phosphorus: npkValues.phosphorus,
            potassium: npkValues.potassium,
          },
        });
  
        // Log the response for debugging
        console.log("YouTube API Response:", response.data);
  
        // Update the videos array with the response data
        setVideos(response.data.videos);
        
        // Update soil issues if present in response
        // if (response.data.soilIssues) {
        //   setSoilIssues({
        //     issues: response.data.soilIssues,
        //     searchTerms: response.data.searchTerms || []
        //   });
        // }
  
        // Set loading state to false for videos
        setLoading(prev => ({ ...prev, videos: false }));
      } catch (error) {
        // Log the error for debugging
        console.error("Error fetching YouTube videos:", error);
  
        // Set loading state to false for videos
        setLoading(prev => ({ ...prev, videos: false }));
  
        // Clear the videos array in case of an error
        setVideos([]);
      }
    };

    // Mock function to fetch fertilizer options
    const fetchFertilizers = async (): Promise<void> => {
      setLoading(prev => ({ ...prev, fertilizers: true }));
      
      // Simulate backend API call
      setTimeout(() => {
        // Mock fertilizer data
        setFertilizers([
          { id: 1, name: "Triple Superphosphate", npk: "0-45-0", price: 24.99, vendor: "GardenSupply", img: "/api/placeholder/100/100" },
          { id: 2, name: "Bone Meal Organic", npk: "3-15-0", price: 19.50, vendor: "OrganicGrow", img: "/api/placeholder/100/100" },
          { id: 3, name: "Rock Phosphate", npk: "0-3-0", price: 15.75, vendor: "EcoFarm", img: "/api/placeholder/100/100" },
          { id: 4, name: "Fish Bone Meal", npk: "4-12-0", price: 22.99, vendor: "MarineNutrients", img: "/api/placeholder/100/100" },
          { id: 5, name: "Bat Guano", npk: "3-10-1", price: 28.50, vendor: "NaturalChoice", img: "/api/placeholder/100/100" },
          { id: 6, name: "Soft Rock Phosphate", npk: "0-4-0", price: 17.25, vendor: "SoilBoost", img: "/api/placeholder/100/100" },
          { id: 7, name: "Organic Phosphorus", npk: "0-12-0", price: 21.99, vendor: "PureGrowth", img: "/api/placeholder/100/100" },
          { id: 8, name: "Liquid Phosphorus", npk: "0-30-0", price: 32.50, vendor: "QuickGreen", img: "/api/placeholder/100/100" },
          { id: 9, name: "Slow-Release Phosphate", npk: "0-18-0", price: 26.99, vendor: "LongFeed", img: "/api/placeholder/100/100" },
          { id: 10, name: "All-Purpose Low K", npk: "10-10-5", price: 18.75, vendor: "BalancedGrow", img: "/api/placeholder/100/100" }
        ]);
        setLoading(prev => ({ ...prev, fertilizers: false }));
      }, 3000);
    };

    // Function to get status color based on nutrient level
    const getNutrientStatus = (value: number): { color: string; status: string } => {
      if (value < 30) return { color: "text-red-500", status: "Low" };
      if (value < 60) return { color: "text-yellow-500", status: "Moderate" };
      return { color: "text-green-500", status: "High" };
    };

    // Load data on component mount
    useEffect(() => {
      fetchNPKValues();
    }, []);

    // Analyze NPK and fetch other data when NPK values change
    useEffect(() => {
      if (npkValues.nitrogen > 0 || npkValues.phosphorus > 0 || npkValues.potassium > 0) {
        fetchRemedies();
        fetchYouTubeVideos();
        fetchFertilizers();
      }
    }, [npkValues]);

    // Function to refresh all data
    const refreshData = (): void => {
      fetchNPKValues();
    };

    return (
      <div className="min-h-screen bg-neutral-900 flex flex-col items-center">
        <div className="w-full max-w-7xl px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-green-400 text-2xl font-bold">Soil NPK Analysis Dashboard</h1>
            <button 
              onClick={refreshData} 
              className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Refresh Data
            </button>
          </div>

          {/* NPK Current Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-white">
            <div className="bg-black bg-opacity-40 backdrop-blur-lg border border-green-950 shadow-lg rounded-2xl p-6">
              <div className="flex flex-col items-center">
                <div className="text-xl mb-1">Nitrogen (N)</div>
                {loading.npk ? (
                  <div className="h-24 w-24 rounded-full border-4 border-t-green-500 border-neutral-700 animate-spin"></div>
                ) : (
                  <>
                    <div className="text-5xl font-bold mb-2">{npkValues.nitrogen}</div>
                    <span className={`${getNutrientStatus(npkValues.nitrogen).color} bg-opacity-20 px-3 py-1 rounded-full text-sm`}>
                      {getNutrientStatus(npkValues.nitrogen).status}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-black bg-opacity-40 backdrop-blur-lg border border-green-950 shadow-lg rounded-2xl p-6">
              <div className="flex flex-col items-center">
                <div className="text-xl mb-1">Phosphorus (P)</div>
                {loading.npk ? (
                  <div className="h-24 w-24 rounded-full border-4 border-t-green-500 border-neutral-700 animate-spin"></div>
                ) : (
                  <>
                    <div className="text-5xl font-bold mb-2">{npkValues.phosphorus}</div>
                    <span className={`${getNutrientStatus(npkValues.phosphorus).color} bg-opacity-20 px-3 py-1 rounded-full text-sm`}>
                      {getNutrientStatus(npkValues.phosphorus).status}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-black bg-opacity-40 backdrop-blur-lg border border-green-950 shadow-lg rounded-2xl p-6">
              <div className="flex flex-col items-center">
                <div className="text-xl mb-1">Potassium (K)</div>
                {loading.npk ? (
                  <div className="h-24 w-24 rounded-full border-4 border-t-green-500 border-neutral-700 animate-spin"></div>
                ) : (
                  <>
                    <div className="text-5xl font-bold mb-2">{npkValues.potassium}</div>
                    <span className={`${getNutrientStatus(npkValues.potassium).color} bg-opacity-20 px-3 py-1 rounded-full text-sm`}>
                      {getNutrientStatus(npkValues.potassium).status}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex border-b border-green-900 text-white">
              <button
                onClick={() => setActiveTab("analysis")}
                className={`px-4 py-2 border-b-2 ${activeTab === "analysis" ? "border-green-500 text-green-400" : "border-transparent"}`}
              >
                Analysis
              </button>
              <button
                onClick={() => setActiveTab("videos")}
                className={`px-4 py-2 border-b-2 ${activeTab === "videos" ? "border-green-500 text-green-400" : "border-transparent"}`}
              >
                Video Solutions
              </button>
              <button
                onClick={() => setActiveTab("fertilizers")}
                className={`px-4 py-2 border-b-2 ${activeTab === "fertilizers" ? "border-green-500 text-green-400" : "border-transparent"}`}
              >
                Fertilizer Options
              </button>
            </div>
            
            {/* Analysis from Gemini */}
            {activeTab === "analysis" && (
              <div className="bg-black bg-opacity-40 text-white backdrop-blur-lg border border-green-950 shadow-lg rounded-2xl mt-4">
                <div className="p-4 border-b border-green-900">
                  <h2 className="flex items-center text-green-400 text-xl font-bold">
                    <Leaf className="mr-2" size={20} />
                    Soil Analysis & Recommendations
                  </h2>
                </div>
                <div className="p-6">
                  {loading.remedies ? (
                    <div className="flex justify-center py-8">
                      <div className="h-12 w-12 rounded-full border-4 border-t-green-500 border-neutral-700 animate-spin"></div>
                    </div>
                  ) : remedies ? (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Analysis:</h3>
                      <p className="mb-4">{remedies.analysis}</p>
                      
                      <h3 className="text-lg font-semibold mb-3">Recommendations:</h3>
                      <ul className="list-disc pl-5 mb-4">
                        {remedies.recommendations.map((rec, idx) => (
                          <li key={idx} className="mb-2">{rec}</li>
                        ))}
                      </ul>
                      
                      <h3 className="text-lg font-semibold mb-3">Suggested Fertilizers:</h3>
                      <div className="flex flex-wrap gap-2">
                        {remedies.suggestedFertilizers.map((fert, idx) => (
                          <span key={idx} className="bg-green-900 bg-opacity-30 border border-green-800 text-green-100 px-3 py-1 rounded-full text-sm">
                            {fert}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p>No analysis available. Please refresh the data.</p>
                  )}
                </div>
              </div>
            )}
            
            {/* YouTube Videos */}
            {activeTab === "videos" && (
              <div className="bg-black text-white bg-opacity-40 backdrop-blur-lg border border-green-950 shadow-lg rounded-2xl mt-4">
                <div className="p-4 border-b border-green-900">
                  <h2 className="flex items-center text-green-400 text-xl font-bold">
                    <Youtube className="mr-2" size={20} />
                    Recommended Solution Videos
                  </h2>
                </div>
                <div className="p-6">
                  {loading.videos ? (
                    <div className="flex justify-center py-8 text-white">
                      <div className="h-12 w-12 rounded-full border-4 border-t-green-500 border-neutral-700 animate-spin"></div>
                    </div>
                  ) : videos.length > 0 ? (
                    <div className="grid text-white grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {videos.map((video) => (
                        <div key={video.id} className="bg-neutral-800 text-white rounded-lg overflow-hidden border border-neutral-700 hover:border-green-700 transition-all">
                          <img 
                            src={video.thumbnail} 
                            alt={video.title} 
                            className="w-full h-40 object-cover"
                          />
                          <div className="p-3">
                            <h3 className="font-medium text-sm line-clamp-2 text-white">{video.title}</h3>
                            <div className="text-xs mt-1 text-white">{video.views} views</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No videos available. Please refresh the data.</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Fertilizer Options */}
            {activeTab === "fertilizers" && (
              <div className="bg-black bg-opacity-40 backdrop-blur-lg border border-green-950 text-white shadow-lg rounded-2xl mt-4">
                <div className="p-4 border-b border-green-900">
                  <h2 className="flex items-center text-green-400 text-xl font-bold">
                    <ShoppingBag className="mr-2" size={20} />
                    Best Fertilizer Deals
                  </h2>
                </div>
                <div className="p-6">
                  {loading.fertilizers ? (
                    <div className="flex justify-center py-8">
                      <div className="h-12 w-12 rounded-full border-4 border-t-green-500 border-neutral-700 animate-spin"></div>
                    </div>
                  ) : fertilizers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {fertilizers.map((fertilizer) => (
                        <div key={fertilizer.id} className="bg-neutral-800 border border-neutral-700 hover:border-green-700 transition-all rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={fertilizer.img} 
                              alt={fertilizer.name} 
                              className="w-16 h-16 object-cover rounded-md"
                            />
                            <div>
                              <h3 className="font-medium">{fertilizer.name}</h3>
                              <span className="mt-1 inline-block bg-green-900 text-green-100 px-2 py-1 rounded-full text-xs">
                                NPK: {fertilizer.npk}
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <div className="text-lg font-bold">${fertilizer.price}</div>
                            <div className="text-sm text-neutral-400">{fertilizer.vendor}</div>
                          </div>
                          <button className="w-full mt-3 bg-green-700 hover:bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-1">
                            View Deal <ArrowRight size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No fertilizer options available. Please refresh the data.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  export default NPKDashboard;