import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/ui/navbar";
import Footer from "./components/Footer";

export default function Layout() {
    const location = useLocation();

    return (
        <div className="">
            <Navbar />
            <Outlet />
            {location.pathname !== "/chatbot" && <Footer />}
        </div>
    );
}
