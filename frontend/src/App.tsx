import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./components/landing";
import Sec from "./components/sec";
import DashboardResult from "./components/resultdashboard";
import ExportShare from "./components/export";
import Comp from "./components/comp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/plan" element={<Sec />} />
        <Route path="/compare" element={<Comp />} />
        <Route path="/dashboardresult" element={<DashboardResult />} />
        <Route path="/export" element={<ExportShare />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
