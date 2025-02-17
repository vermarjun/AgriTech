import smartWeather from "/smartAgri.png"
import agriVisionAI from "/agriVisionAI.png"
import soilMonitoring from "/soilMonitoring.png"
import webDashboard from "/webDashboard.png"
import appDashboard from "/appDashboard.jpeg"
import diseaseScanner from "/diseaseScanner.jpg"

import { useState } from "react";

const cards = [
  { id: 1, image: webDashboard, text: "Card 1 Info", displayText: "Web Dashboard" },
  { id: 2, image: appDashboard, text: "App Dashboard" , displayText: "App Dashboard" },
  { id: 3, image: agriVisionAI, text: "Agrivision AI" , displayText: "Agrivision AI" },
  { id: 4, image: diseaseScanner, text: "Disease Scanner" , displayText: "Disease Scanner" },
  { id: 5, image: soilMonitoring, text: "Live Soil Monitoring" , displayText: "Live Soil Monitoring" },
  { id: 6, image: smartWeather, text: "Card 6 Info" , displayText: "Smart Weather Prediction" },
];

export default function CardGrid() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-20 mb-20">
      {cards.map((card) => (
        <div
          key={card.id}
          className="flex justify-center items-end relative w-full h-64 bg-cover bg-center rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
          style={{ backgroundImage: `url(${card.image})` }}
          // @ts-ignore
          onMouseEnter={() => setHoveredId(card.id)}
          onMouseLeave={() => setHoveredId(null)}
          data-aos="fade-up" data-aos-easing="ease-in-out" data-aos-delay="250" 
          
        >
          {hoveredId === card.id && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-md text-white text-lg font-semibold p-4 rounded-xl">
              {card.text}
            </div>
          )}
          <p className="w-full text-center backdrop-filter backdrop-blur-lg bg-opacity-30 text-white font-bold text-sm py-2">{card.displayText}</p>
        </div>
      ))}
    </div>
  );
}
