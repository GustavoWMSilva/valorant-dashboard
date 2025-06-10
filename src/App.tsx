import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import RoleInsightsPage from './pages/RoleInsightsPage';
import AgentTrendsPage from './pages/AgentTrendsPage';
import MapInsightsPage from './pages/MapInsightsPage';

const App = () => {
  return (
    <BrowserRouter>
      <nav className="bg-indigo-600 text-white p-4 flex gap-4 justify-center">
        <Link to="/" className="font-semibold hover:underline">Dashboard</Link>
        <Link to="/roles" className="font-semibold hover:underline">Funções</Link>
        <Link to="/agents" className="font-semibold hover:underline">Tendências</Link>
        <Link to="/maps" className="font-semibold hover:underline">Mapas</Link>
      </nav>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/roles" element={<RoleInsightsPage />} />
        <Route path="/agents" element={<AgentTrendsPage />} />
        <Route path="/maps" element={<MapInsightsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
