import "./MainLayout.css";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";


function MainLayout({ children }) {

    return (

        <div style={{ display: "flex" }}>

            <Sidebar />

            <div className="main-content">

                <Topbar />

                <div className="page-content">

                    {children}

                </div>

            </div>

        </div>

    );

}

export default MainLayout;