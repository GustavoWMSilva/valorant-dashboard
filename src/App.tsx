import { useState } from 'react';
import dados from './data/grafico_valorant.json';
import RatingByAggression from './components/RatingByAggression';
import HeatmapRating from './components/HeatmapRating';
import aggressivenessDataRaw from './data/aggressiveness_raw.json';

type AggressivenessData = {
  Ano: number;
  // Add other fields as needed based on your JSON structure
};

const aggressivenessData: AggressivenessData[] = aggressivenessDataRaw as AggressivenessData[];
import AggressivenessDistribution from './components/AggressivenessDistribution';
import StackedAggressionBar from './components/StackedAggressionBar';
import RadarAggressionChart from './components/RadarChart';


type ValorantData = {
  Ano: number;
  Agents_stats: string;
  "Faixa de Agressividade": string;
  Rating_stats: number;
  Count: number;
};

const ordemFaixas = [
  "0–0.05",
  "0.05–0.10",
  "0.10–0.15",
  "0.15–0.20",
  "0.20–0.30",
  "0.30–0.50",
];

function App() {
  const anosUnicos = Array.from(new Set(dados.map((d) => d.Ano))).sort();
  const agentesUnicos = Array.from(new Set(dados.map((d) => d.Agents_stats))).sort();

  const [anoSelecionado, setAnoSelecionado] = useState<number>(2024);
  const [agenteSelecionado, setAgenteSelecionado] = useState<string>('Todos');

  const dadosFiltrados: ValorantData[] = dados
    .filter((d) => d.Ano === anoSelecionado && d.Agents_stats === agenteSelecionado)
    .sort((a, b) => {
      return (
        ordemFaixas.indexOf(a["Faixa de Agressividade"]) -
        ordemFaixas.indexOf(b["Faixa de Agressividade"])
      );
    });

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-gray-100 to-indigo-50 flex flex-col">
      <header className="w-full bg-indigo-600 py-6 shadow-md">
        <h1 className="text-4xl font-bold text-white text-center">
          Valorant Dashboard – Agressividade e Performance
        </h1>
      </header>

      <main className="flex-grow p-6 flex flex-col gap-6 items-center">
        <div className="w-full max-w-6xl bg-white rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <label htmlFor="ano" className="text-lg font-medium text-gray-700">
                Ano:
              </label>
              <select
                id="ano"
                value={anoSelecionado}
                onChange={(e) => setAnoSelecionado(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-4 py-2 shadow-sm"
              >
                {anosUnicos.map((ano) => (
                  <option key={ano} value={ano}>
                    {ano}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <label htmlFor="agente" className="text-lg font-medium text-gray-700">
                Agente:
              </label>
              <select
                id="agente"
                value={agenteSelecionado}
                onChange={(e) => setAgenteSelecionado(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 shadow-sm"
              >
                {agentesUnicos.map((agente) => (
                  <option key={agente} value={agente}>
                    {agente}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="w-full h-[500px]">
            <RatingByAggression data={dadosFiltrados} />
          </div>

          <div className="w-full h-[500px] mt-10">
            <HeatmapRating data={dados.filter(d => d.Ano === anoSelecionado)} agenteSelecionado={agenteSelecionado} />
          </div>
          {/* <div className="w-full h-[500px] mt-10">
            <AggressivenessDistribution
              data={aggressivenessData}
              anoSelecionado={anoSelecionado}
              agenteSelecionado={agenteSelecionado}
            />         
          </div> */}
          {/* <div className="w-full h-[500px] mt-10">
            <StackedAggressionBar
              data={dados.filter(d => d.Ano === anoSelecionado)}
              anoSelecionado={anoSelecionado}
            />
          </div> */}
          <RadarAggressionChart
  data={dados}
  anoSelecionado={anoSelecionado}
  agentesSelecionados={[agenteSelecionado]}
/>




        </div>
      </main>

      <footer className="w-full text-center py-4 text-sm text-gray-500">
        Projeto de Visualização de Dados – PUCRS © 2025
      </footer>
    </div>
  );
}

export default App;
