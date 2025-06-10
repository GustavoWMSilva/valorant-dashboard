import { useState } from 'react';
import dados from '../data/grafico_valorant.json';
import RatingByAggression from '../components/RatingByAggression';
import HeatmapRating from '../components/HeatmapRating';
import RadarAggressionChart from '../components/RadarChart';
import Select from 'react-select';
import type { CSSObjectWithLabel, MultiValueProps, StylesConfig } from 'react-select';
import PainelEconomiaRodadas from '../components/PainelEconomiasRodadas';
import ecoRounds from '../data/eco_rounds.json';


type ValorantData = {
  Ano: number;
  Agents_stats: string;
  "Faixa de Agressividade": string;
  Rating_stats: number;
  Count: number;
};

type RatingByAggressionData = ValorantData & { Agent: string };

const ordemFaixas = [
  "0–0.05",
  "0.05–0.10",
  "0.10–0.15",
  "0.15–0.20",
  "0.20–0.30",
  "0.30–0.50",
];

const palette = [
  '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
  '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
];

const getAgenteImagePath = (agente: string) => {
  const nomeFormatado = agente.charAt(0).toUpperCase() + agente.slice(1).toLowerCase();
  return `/images/agentes/${nomeFormatado}_-_Full_body.png`;
};
const getAgenteFaceImagePath = (agente: string) => {
  const map: Record<string, string> = {
    'kayo': 'KAYO_icon.png',
    'yoru': 'Yoru_icon.webp',
  };
  const nome = agente.toLowerCase();
  if (map[nome]) return `/images/agentes/face/${map[nome]}`;
  const nomeFormatado = agente.charAt(0).toUpperCase() + agente.slice(1).toLowerCase();
  return `/images/agentes/face/${nomeFormatado}_icon.png`;
};

function App() {
  const anosUnicos = Array.from(new Set(dados.map((d) => d.Ano))).sort();
  const agentesUnicos = Array.from(new Set(dados.map((d) => d.Agents_stats))).sort();
  const [selectAgente, setSelectAgente] = useState<string>(''); // Estado para o agente selecionado


  const [anoSelecionado, setAnoSelecionado] = useState<number>(2024);
  const [agenteSelecionado, setAgenteSelecionado] = useState<string[]>(['jett']);

  const dadosFiltrados: RatingByAggressionData[] = dados
    .filter((d) => d.Ano === anoSelecionado && agenteSelecionado.includes(d.Agents_stats))
    .map((d) => ({ ...d, Agent: d.Agents_stats }))
    .sort(
      (a, b) =>
        ordemFaixas.indexOf(a["Faixa de Agressividade"]) -
        ordemFaixas.indexOf(b["Faixa de Agressividade"])
    );

  const agentColors = Object.fromEntries(
    agenteSelecionado.map((agente, index) => [agente, palette[index % palette.length]])
  );

    // Gerar opções com cores
    const agenteOptions = agentesUnicos.map((agente) => ({
      value: agente,
      label: agente,
      color: agentColors[agente] || '#ccc',
    }));
    // Estilo personalizado para mostrar as cores nos chips selecionados
  
  type AgenteOption = {
    value: string;
    label: string;
    color: string;
  };
  
    const customStyles: StylesConfig<AgenteOption, true> = {
    multiValue: (styles: CSSObjectWithLabel, props: MultiValueProps<AgenteOption, true>) => ({
      ...styles,
      backgroundColor: props.data.color,
      color: 'white',
    }),
    multiValueLabel: (styles: CSSObjectWithLabel) => ({
      ...styles,
      color: 'white',
    }),
    control: (styles: CSSObjectWithLabel) => ({
      ...styles,
      minHeight: '40px',
    }),
    menu: (styles: CSSObjectWithLabel) => ({
      ...styles,
      zIndex: 9999,
    }),
  };

  const handleAgenteClick = (agente: string) => {
  if (selectAgente === agente) {
    setSelectAgente(''); // Desseleciona se já estiver selecionado
  }else {
    setSelectAgente(agente); // Seleciona o agente
  }
};
 // Valor padrão (mantido apenas como constante, se necessário)


  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-gray-100 to-indigo-50 flex flex-col">
      <header className="w-full bg-indigo-600 py-6 shadow-md">
        <h1 className="text-4xl font-bold text-white text-center">
          Valorant Dashboard – Agressividade e Performance
        </h1>
      </header>

      <main className="flex-grow p-6 grid grid-cols-12 gap-6 max-w-screen-2xl mx-auto">
        {/* Bloco 1: Filtros e imagem */}
        <div className="col-span-3 bg-white rounded-2xl p-6 shadow-xl flex flex-col items-center justify-between max-h-[600px]">
          <div className="w-full">
            <div className="flex flex-col gap-4 mb-6 w-full">
              <div className="flex flex-col">
                <label htmlFor="ano" className="text-lg font-medium text-gray-700 mb-1">
                  Ano:
                </label>
                <Select
                  options={anosUnicos.map((ano) => ({ value: ano, label: ano.toString() }))}
                  value={{ value: anoSelecionado, label: anoSelecionado.toString() }}
                  onChange={(selectedOption) =>
                    selectedOption && setAnoSelecionado(Number(selectedOption.value))
                  }
                  styles={{
                    control: (styles) => ({ ...styles, minHeight: '40px' }),
                    menu: (styles) => ({ ...styles, zIndex: 9999 }),
                  }}
                  className="w-full"
                  classNamePrefix="react-select"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="agente" className="text-lg font-medium text-gray-700 mb-1">
                  Agentes: {agenteSelecionado.length}/5
                </label>
                <Select
                  isMulti
                  options={agenteOptions}
                  value={agenteOptions.filter((o) => agenteSelecionado.includes(o.value))}
                  onChange={(selected) => {
                    if (selected.length === 0) return; // impede remover todos
                    if (selected.length <= 5) {
                      setAgenteSelecionado(selected.map((s) => s.value));
                    }
                  }}

                  styles={customStyles}
                  className="w-full"
                  classNamePrefix="react-select"
                  placeholder="Selecione agentes..."
                />
              </div>
            </div>
            {agenteSelecionado.length === 1 ? (
              <img
                src={getAgenteImagePath(agenteSelecionado[0])}
                alt={agenteSelecionado[0]}
                className="h-64 w-[500px] object-contain rounded-lg shadow-md"
              />
            ) : (
              <div className="h-fit w-[308px] flex flex-wrap justify-center items-center gap-4 rounded-lg shadow-md bg-white p-2">
                {agenteSelecionado.map((agente) => (
                  <img
                    key={agente}
                    src={getAgenteFaceImagePath(agente)}
                    alt={agente}
                    className="h-20 w-20 object-contain rounded-full border border-gray-300"
                    title={agente}
                  />
                ))}
              </div>
          )}
          </div>
        </div>

        {/* Bloco 2 */}
        <div className="col-span-9 bg-white rounded-2xl p-6 shadow-xl h-[600px] ">
          <RatingByAggression
            data={dadosFiltrados.sort((a, b) => {
              const indexA = agentesUnicos.indexOf(a.Agents_stats);
              const indexB = agentesUnicos.indexOf(b.Agents_stats);
              return indexA - indexB;
            })}
            selectAgente={selectAgente}
            onAgenteClick={handleAgenteClick}
          />        
        </div>

        {/* Bloco 4 */}
        <div className="col-span-6 bg-white rounded-2xl p-6 shadow-xl h-[600px]">
          <RadarAggressionChart
            data={dados}
            agenteFocado={selectAgente}
            anoSelecionado={anoSelecionado}
            agentesSelecionados={agenteSelecionado.sort((a, b) => {
              const indexA = agentesUnicos.indexOf(a);
              const indexB = agentesUnicos.indexOf(b);
              return indexA - indexB;
            }
            )}            onAgenteClick={handleAgenteClick}

          />
        </div>

        {/* Bloco 3 */}
        <div className="col-span-6 bg-white rounded-2xl p-6 shadow-xl h-[600px]">
          <HeatmapRating
            data={dados.filter((d) => d.Ano === anoSelecionado)}
              // selectAgente={selectAgente}
            onAgenteClick={handleAgenteClick}
            agenteFocado={selectAgente}

            agentesSelecionados={agenteSelecionado.sort((a, b) => {
              const indexA = agentesUnicos.indexOf(a);
              const indexB = agentesUnicos.indexOf(b);
              return indexA - indexB;
            }
            )}
          />
        </div>
        <div className="col-span-12 bg-white rounded-2xl p-20 shadow-xl h-[600px]">
          <PainelEconomiaRodadas data={ecoRounds.map(er => ({
            ...er,
            Outcome: er.Outcome === 'Win' ? 'Win' : 'Loss'
          }))} />
        </div>
      </main>

      <footer className="w-full text-center py-4 text-sm text-gray-500">
        Projeto de Visualização de Dados – PUCRS © 2025
      </footer>
    </div>
  );
}

export default App;
