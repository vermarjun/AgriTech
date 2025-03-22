import { useLocation } from "react-router-dom";
import { URL } from "../../App.tsx";
import logo from "/leafIcon.png";

// @ts-ignore
function NavbarItem(props: any) {
    const location = useLocation();
    return (
        <li>
            <p onClick={() => window.location.href = `${URL}/`} className={`font-semibold transition-all text-lg hover:cursor-pointer hover:scale-105 hover:backdrop-filter hover:backdrop-blur-lg hover:bg-opacity-30 p-2 rounded-xl ${location.pathname === "/" ? "text-black" : "text-white"}`}>
                {props.text}
            </p>
        </li>
    );
}

export default function Navbar2() {
    // @ts-ignore
    const location = useLocation();

    return (
        <div className="fixed top-0 left-0 z-50 flex justify-between items-center px-16 backdrop-filter backdrop-blur-lg bg-opacity-30 w-full h-20 bg-green-950">
            <div className="backdrop-filter backdrop-blur-lg bg-opacity-0 rounded-lg text-white">
                <div className="w-fit flex justify-center gap-2 items-center p-3 rounded-xl">
                    <img src={logo} alt="" className="h-8" />
                    <p className="text-2xl font-bold">Agri Smart</p>
                </div>
            </div>
            <div className="w-fit flex justify-center">
                <ul className="flex gap-10 justify-center items-center">
                <div className="flex items-center space-x-4">
                <button className="bg-white p-1 px-2 rounded-lg text-black animate-pulse">
                    <a href={`${URL}/user`}>
                    <p className="font-bold text-xs">Dashboard</p>
                    </a>
                </button>
                <button className="bg-white p-1 px-2 rounded-lg text-black animate-pulse">
                    <a href="http://192.168.165.123:8501">
                    <p className="font-bold text-xs">Scan Diseases</p>
                    </a>
                </button>
                <button className="bg-white p-1 px-2 rounded-lg text-black animate-pulse">
                    <a href={`${URL}/user/live`}>
                    <p className="font-bold text-xs">Live Data</p>
                    </a>
                </button>
                <button className="bg-white p-1 px-2 rounded-lg text-black animate-pulse">
                    <a href={`${URL}/user/remedies`}>
                    <p className="font-bold text-xs">Remedies</p>
                    </a>
                </button>
                <button className="bg-white p-1 px-2 rounded-lg text-black animate-pulse">
                    <a href={`${URL}/user/chatbot`}>
                    <p className="font-bold text-xs">Agri AI</p>
                    </a>
                </button>
                <button className="bg-white p-1 px-2 rounded-lg text-black animate-pulse">
                    <a href="./KisanStore - Revolution Farmer-to-Consumer E-Commerce Platform.html">
                    <p className="font-bold text-xs">Kisan Store</p>
                    </a>
                </button>
                <button className="bg-white p-1 px-2 rounded-lg text-black" onClick={()=>{
                    window.location.href = `${URL}/dashboard.html`
                }}>
                    <p className="font-bold text-xs">Govt. Data</p>
                </button>
                <button className="text-gray-300 hover:text-white">
                    <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    ></path>
                    </svg>
                </button>
                <button className="text-gray-300 hover:text-white">
                    <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                    </svg>
                </button>
                </div>
                </ul>
            </div>
        </div>
    );
}