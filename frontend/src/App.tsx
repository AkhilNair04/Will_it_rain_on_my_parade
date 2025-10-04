import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './components/landing';
import Sec from './components/sec';
import Comp from './components/comp';
import DashboardResult from './components/resultdashboard';
import ExportShare from './components/export';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <>
            <Landing />
            <Sec />
            <Comp />
          </>
        } />
        <Route path="/dashboardresult" element={<DashboardResult/>} />
        <Route path="/export" element={<ExportShare />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;