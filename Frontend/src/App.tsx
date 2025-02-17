import Home from "./components/Home"
// import ChatScreen from "./components/ChatScreen"
import { Routes, Route, BrowserRouter } from "react-router-dom"
import Layout from "./Layout"
import ChatScreen from "./components/ChatScreen"
import GraphDisplay from "./components/LiveData"

export const API_URL:string = "http://localhost:3000";
export const URL:string = "https://agri-tech-orcin.vercel.app/";

export default function App() {
  return (
    <div className={``}>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout/>}>
              <Route index element={<Home/>}/>
              <Route path="/chatbot" element={<ChatScreen/>}></Route>
              <Route path="/live" element={<GraphDisplay/>}></Route>
            </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
