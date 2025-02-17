import IndianMap from "/map.png"
import AOS from "aos";
import { useEffect } from "react";
import "aos/dist/aos.css";

export default function Problem(){
    useEffect(() => {
        AOS.init();
        AOS.refresh();
      }, []);
    return <div className="bg-green-50 h-screen w-screen flex flex-col justify-start items-center">
        <div data-aos="fade-up" data-aos-easing="ease-in-out" data-aos-delay="450" className="flex flex-col items-center justify-center gap-5 font-medium">
            <p className="text-center underline text-green-800 font-extrabold text-4xl">
            Excessive Use of Pesticides is Destroying Soil and Crops!
            </p>
            <p className="text-center text-green-950 w-4/6 text-xl">
                Due to a lack of disease identification tools, farmers randomly spray pesticides, harming soil fertility, reducing crop quality, and increasing health risks for consumers.
            </p>
        </div>
        <div className="flex justify-center ml-24 items-center h-full w-screen">
            <div data-aos="fade-right" data-aos-easing="ease-in-out" data-aos-delay="450" className="h-full w-2/5 flex flex-col justify-center items-center gap-10">
                <div>
                    <p className="font-bold text-2xl text-green-800">
                        Soil Degradation is a Silent Killer
                    </p>
                    <p>
                        Overuse of fertilizers and poor soil management deplete soil nutrients over time. Without constant monitoring, farmers unknowingly degrade their land, making farming unsustainable.
                    </p>
                </div>
                <div>
                    <p className="font-bold text-2xl text-green-800">
                        High Farming Costs Eat into Profits 
                    </p>
                    <p>
                        With increasing prices of fertilizers, pesticides, and water usage, farmers struggle to maintain profitability. Without a data-driven approach, expenses rise without guaranteed returns.
                    </p>
                </div>
                <p>
                </p>
            </div>
            <div data-aos="fade-left" data-aos-easing="ease-in-out" data-aos-delay="150" className="w-2/5 flex justify-center items-center h-full">
                <img src={IndianMap} alt="" className="h-80"/>
            </div>

        </div>
    </div>
}