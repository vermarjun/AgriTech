import { Outlet, useLocation } from "react-router-dom";
import Navbar2 from "./components/ui/navbar2.tsx";
import Footer from "./components/Footer";

export default function LoggedInLayout() {
    const location = useLocation();

    return (
        <div className="">
            <Navbar2 />
            <Outlet />
            {location.pathname !== "/chatbot" && <Footer />}
        </div>
    );
}
