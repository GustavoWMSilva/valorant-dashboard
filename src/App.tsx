import { useState } from 'react';
import dados from './data/grafico_valorant.json';
import RatingByAggression from './components/RatingByAggression';
import HeatmapRating from './components/HeatmapRating';
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

const getAgenteImagePath = (agente: string) => {
  const nomeFormatado = agente.charAt(0).toUpperCase() + agente.slice(1).toLowerCase();
  return `/images/agentes/${nomeFormatado}_-_Full_body.png`;
};

function App() {
  const anosUnicos = Array.from(new Set(dados.map((d) => d.Ano))).sort();
  const agentesUnicos = Array.from(new Set(dados.map((d) => d.Agents_stats))).sort();

  const [anoSelecionado, setAnoSelecionado] = useState<number>(2024);
  const [agenteSelecionado, setAgenteSelecionado] = useState<string>('Todos');

  const dadosFiltrados: ValorantData[] = dados
    .filter((d) => d.Ano === anoSelecionado && d.Agents_stats === agenteSelecionado)
    .sort((a, b) => (
      ordemFaixas.indexOf(a["Faixa de Agressividade"]) -
      ordemFaixas.indexOf(b["Faixa de Agressividade"])
    ));

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-gray-100 to-indigo-50 flex flex-col">
      <header className="w-full bg-indigo-600 py-6 shadow-md">
        <h1 className="text-4xl font-bold text-white text-center">
          Valorant Dashboard – Agressividade e Performance
        </h1>
      </header>

      <main className="flex-grow p-6 grid grid-cols-12 gap-6 max-w-screen-2xl mx-auto">
        {/* Bloco 1: Filtros e imagem */}
        <div className="col-span-3 bg-white rounded-2xl p-6 shadow-xl flex flex-col items-center justify-between">
            <div className="w-full">
            <div className="flex flex-col gap-4 mb-6 w-full">
              <div className="flex flex-col">
              <label htmlFor="ano" className="text-lg font-medium text-gray-700 mb-1">
                Ano:
              </label>
              <select
                id="ano"
                value={anoSelecionado}
                onChange={(e) => setAnoSelecionado(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-4 py-2 shadow-sm w-full"
              >
                {anosUnicos.map((ano) => (
                <option key={ano} value={ano}>{ano}</option>
                ))}
              </select>
              </div>
              <div className="flex flex-col">
              <label htmlFor="agente" className="text-lg font-medium text-gray-700 mb-1">
                Agente:
              </label>
              <select
                id="agente"
                value={agenteSelecionado}
                onChange={(e) => setAgenteSelecionado(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 shadow-sm w-full"
              >
                {agentesUnicos.map((agente) => (
                <option key={agente} value={agente}>{agente}</option>
                ))}
              </select>
              </div>
            </div>

            {agenteSelecionado !== "Todos" ? (
              <img
              src={getAgenteImagePath(agenteSelecionado)}
              alt={agenteSelecionado}
              className="h-64  w-[500px] object-contain rounded-lg shadow-md"
              />
            ) : (
              <img
              src="/images/agentes/Todos_-_Full_body.png"
              alt="Ícone"
              className="h-64 w-[500px] object-contain rounded-lg shadow-md filter invert "
              />
            )}
            </div>
        </div>

        {/* Bloco 2 */}
        <div className="col-span-9 bg-white rounded-2xl p-6 shadow-xl h-[500px] ">
          <RatingByAggression data={dadosFiltrados} />
        </div>

        {/* Bloco 4 */}
        <div className="col-span-6 bg-white rounded-2xl p-6 shadow-xl h-[500px]">
          <RadarAggressionChart
            data={dados}
            anoSelecionado={anoSelecionado}
            agentesSelecionados={[agenteSelecionado]}
          />
        </div>

        {/* Bloco 3 */}
        <div className="col-span-6 bg-white rounded-2xl p-6 shadow-xl h-[500px]">
          <HeatmapRating
            data={dados.filter(d => d.Ano === anoSelecionado)}
            agenteSelecionado={agenteSelecionado}
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
