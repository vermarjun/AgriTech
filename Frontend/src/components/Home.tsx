import bg from "/bg.jpg"
// import WhoAreWe from "./WhoAreWe"
import ReachUs from "./ReachUs"
import Carousel from "./RecognitionCarousel"
import Solution from "./Solution"
import Problem from "./Problem"
import chatBubble from "/chatBubble.png"

export function ChatButton(){
    return (
      <div className="fixed right-8 rounded-xl bottom-10 flex flex-col justify-center items-center">
          <img src={chatBubble} alt="" className="h-14"/>
          <p className="font-semibold text-xs">AI Chat Bot</p>
      </div>
    )
  }             

export function Landing(){
    return (
        <div className="flex flex-col justify-center items-center h-screen w-screen">
            <div className="relative h-5/6 w-screen flex justify-start px-10 bg-cover" style={{ backgroundImage: `url(${bg})` }}>
                <p className="text-white text-8xl font-bold mt-48 bg-opacity-0 text-center font-poppins">Agri Smart</p>
                <div className="absolute -bottom-10 left-0 w-full">
                <svg viewBox="0 0 1440 100" width="100%" height="100" xmlns="http://www.w3.org/2000/svg">
                    <path fill="white" d="M0,50 C150,100 300,0 450,50 C600,100 750,0 900,50 C1050,100 1200,0 1350,50 L1440,50 L1440,100 L0,100Z" />
                </svg>
                </div>
            </div>
        </div>
    )
}

export default function Home(){
    return (
        <div className="w-screen overflow-hidden">
            <Landing/>
            <ChatButton/>
            <Problem/>
            <Solution/>
            {/* <WhoAreWe/> */}
            <Carousel/>
            <ReachUs/>
        </div>
    )
}