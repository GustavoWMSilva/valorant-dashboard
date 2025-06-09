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
  const teams = Array.from(new Set((mapData as Entry[]).map(d => d.Team))).sort();
  const [team, setTeam] = useState<string>(teams[0]);
  const filtered = (mapData as Entry[]).filter(d => d.Team === team);

  // Função para gerar o nome do arquivo da logo
  function getLogoFileName(team: string) {
    const map: Record<string, string> = {
      'Sentinels': 'sentinels.png',
      'FNATIC': 'fnatic.png',
      'LOUD': 'loud.png',
      'DRX': 'DRX.png',
      'Team Liquid': 'liquid.png',
      'Paper Rex': 'prx.png',
    };
    return map[team] || team.toLowerCase().replace(/ /g, '_') + '.png';
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-gray-100 to-indigo-50 flex flex-col">
      <header className="w-full bg-indigo-600 py-6 shadow-md">
        <h1 className="text-4xl font-bold text-white text-center">Insights de Mapas</h1>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center p-6 max-w-screen-2xl mx-auto w-full">
        <div className="w-full flex flex-col md:flex-row gap-8 mb-8 items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-xl flex flex-col gap-4 min-w-[260px] max-w-xs w-full items-center border border-indigo-100">
            {/* Logo do time selecionado */}
            <img
              src={"/images/times/" + getLogoFileName(team)}
              alt={team + " logo"}
              className="w-24 h-24 object-contain mb-2 drop-shadow-md"
              onError={e => (e.currentTarget.style.display = 'none')}
            />
            <label className="font-semibold text-gray-700 text-lg mb-2" htmlFor="team-select">Times</label>
            <Select
              inputId="team-select"
              options={teams.map(t => ({ value: t, label: t }))}
              value={{ value: team, label: team }}
              onChange={opt => opt && setTeam(opt.value)}
              classNamePrefix="react-select"
              styles={{ container: base => ({ ...base, width: '100%' }) }}
            />
          </div>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-xl h-[400px] flex items-center justify-center">
            <MapPickRateBar data={filtered} />
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-xl h-[400px] flex items-center justify-center">
            <SideWinPercentageChart data={filtered} />
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-xl h-[400px] flex items-center justify-center">
            <MapWinLossChart data={filtered} />
          </div>
        </div>
      </main>
      <footer className="w-full text-center py-4 text-sm text-gray-500">Projeto de Visualização de Dados – PUCRS © 2025</footer>
    </div>
  );
};

export default MapInsightsPage;
