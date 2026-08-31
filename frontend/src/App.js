import MainLayout from "./components/layout/MainLayout";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import { ToastContainer } from "react-toastify";
import ThreatAnalysis from "./components/ThreatAnalysis";

function App(){
     return(
       <>
            <MainLayout>
              <DashboardPage/>
            </MainLayout>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                newestOnTop
                pauseOnHover
            />

            <div>
                <ThreatAnalysis missionId={1} />
            </div>

        </>

    );
}

export default App;