import { useState } from 'react';
import mapData from '../data/map_stats.json';
import MapPickRateBar from '../components/MapPickRateBar';
import SideWinPercentageChart from '../components/SideWinPercentageChart';
import MapWinLossChart from '../components/MapWinLossChart';
import Select from 'react-select';

interface Entry {
  Team: string;
  Map: string;
  PickRate: number;
  AttackerSideWinPercentage: number;
  DefenderSideWinPercentage: number;
  TotalWinsByMap: number;
  TotalLossByMap: number;
}

const MapInsightsPage = () => {
  const teams = Array.from(new Set((mapData as Entry[]).map(d => d.Team)));
  const [team, setTeam] = useState<string>(teams[0]);
  const filtered = (mapData as Entry[]).filter(d => d.Team === team);

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-gray-100 to-indigo-50 flex flex-col">
      <header className="w-full bg-indigo-600 py-6 shadow-md">
        <h1 className="text-4xl font-bold text-white text-center">Insights de Mapas</h1>
      </header>
      <main className="flex-grow p-6 grid grid-cols-12 gap-6 max-w-screen-2xl mx-auto">
        <div className="col-span-3 bg-white rounded-2xl p-6 shadow-xl h-fit flex flex-col gap-4">
          <Select
            options={teams.map(t => ({ value: t, label: t }))}
            value={{ value: team, label: team }}
            onChange={opt => opt && setTeam(opt.value)}
            classNamePrefix="react-select"
          />
        </div>
        <div className="col-span-9 grid grid-cols-1 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-xl h-[600px]">
            <MapPickRateBar data={filtered} />
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-xl h-[600px]">
            <SideWinPercentageChart data={filtered} />
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-xl h-[600px]">
            <MapWinLossChart data={filtered} />
          </div>
        </div>
      </main>
      <footer className="w-full text-center py-4 text-sm text-gray-500">Projeto de Visualização de Dados – PUCRS © 2025</footer>
    </div>
  );
};

export default MapInsightsPage;
