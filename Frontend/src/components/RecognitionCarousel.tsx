// import React from "react";
import "./RecognitionCarousel.css"
import bni from "/bni.jpeg"
import agriClg from "/agriClg.jpeg"
import IITM from "/IITM.jpeg"
import parulUni from "/parulUni.jpeg"

const logos = [
  { src: bni, alt: "FITT", link: "https://fitt-iitd.in/web/home" },
  { src: agriClg, alt: "IIT-D", link: "https://home.iitd.ac.in/" },
  { src: IITM, alt: "Samsung", link: "https://www.samsung.com/in/solvefortomorrow/" },
  { src: parulUni, alt: "GGV, Bilaspur", link: "https://www.new.ggu.ac.in/" },
];

const divider = "https://www.bhujal.tech/static/images/logos/logos_divider.png";

const Carousel = () => {
    return (
        <div className="relative w-full overflow-hidden py-8">
          {/* Gradient Blur Effect */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white via-transparent to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white via-transparent to-transparent z-10"></div>
          
          <div className="flex w-max animate-slide" style={{ animation: "scroll 15s linear infinite" }}>
            {[...logos, ...logos].map((logo, index) => (
              <div key={index} className="flex items-center">
                <a href={logo.link} target="_blank" rel="noopener noreferrer">
                  <img src={logo.src} alt={logo.alt} className="object-contain max-w-40 mx-6 max-h-6" />
                </a>
                <img src={divider} alt="Divider" className="object-contain w-10 p-2 mx-6" />
              </div>
            ))}
          </div>
        </div>
      );
};

export default Carousel;
