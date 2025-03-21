import Home from "./components/Home"
// import ChatScreen from "./components/ChatScreen"
import { Routes, Route, BrowserRouter } from "react-router-dom"
import Layout from "./Layout"
import ChatScreen from "./components/ChatScreen"
import GraphDisplay from "./components/LiveData"
import Remedies from "./components/Remedies"

export const API_URL:string = "http://localhost:3000";
export const URL:string = "http://localhost:5173";

export default function App() {
  return (
    <div className={``}>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout/>}>
              <Route index element={<Home/>}/>
              <Route path="/chatbot" element={<ChatScreen/>}></Route>
              <Route path="/live" element={<GraphDisplay/>}></Route>
              <Route path="/remedies" element={<Remedies/>}></Route>
            </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
