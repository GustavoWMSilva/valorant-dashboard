import { useState } from 'react';
import dados from '../data/grafico_valorant.json';
import Select from 'react-select';
import type { CSSObjectWithLabel, MultiValueProps, StylesConfig } from 'react-select';
import RatingTrendChart from '../components/RatingTrendChart';
import RatingAggressionScatter from '../components/RatingAggressionScatter';

interface ValorantData {
  Ano: number;
  Agents_stats: string;
  "Faixa de Agressividade": string;
  Rating_stats: number;
  Count: number;
}

const palette = [
  '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
  '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
];

const getAgenteImagePath = (agente: string) => {
  const nomeFormatado = agente.charAt(0).toUpperCase() + agente.slice(1).toLowerCase();
  return `/images/agentes/${nomeFormatado}_-_Full_body.png`;
};

const getAgenteFaceImagePath = (agente: string) => {
  const nomeFormatado = agente.charAt(0).toUpperCase() + agente.slice(1).toLowerCase();
  return `/images/agentes/face/${nomeFormatado}_icon.png`;
};

const AgentTrendsPage = () => {
  const anos = Array.from(new Set(dados.map(d => d.Ano))).sort();
  const agentes = Array.from(new Set(dados.map(d => d.Agents_stats))).filter(a => a !== 'Todos').sort();
  const [agentesSelecionados, setAgentesSelecionados] = useState<string[]>(['jett']);
  const [anoSelecionado, setAnoSelecionado] = useState<number>(anos[0]);

  const agenteOptions = agentes.map(a => ({ value: a, label: a }));

  type AgenteOption = { value: string; label: string };

  const customStyles: StylesConfig<AgenteOption, true> = {
    multiValue: (styles: CSSObjectWithLabel, props: MultiValueProps<AgenteOption, true>) => ({
      ...styles,
      backgroundColor: palette[agentesSelecionados.indexOf(props.data.value) % palette.length],
      color: 'white',
    }),
    multiValueLabel: (styles: CSSObjectWithLabel) => ({
      ...styles,
      color: 'white',
    }),
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-gray-100 to-indigo-50 flex flex-col">
      <header className="w-full bg-indigo-600 py-6 shadow-md">
        <h1 className="text-4xl font-bold text-white text-center">Tendências de Agentes</h1>
      </header>
      <main className="flex-grow p-6 grid grid-cols-12 gap-6 max-w-screen-2xl mx-auto">
        <div className="col-span-3 bg-white rounded-2xl p-6 shadow-xl h-fit flex flex-col gap-4">
          <Select
            options={anos.map(a => ({ value: a, label: a.toString() }))}
            value={{ value: anoSelecionado, label: anoSelecionado.toString() }}
            onChange={opt => opt && setAnoSelecionado(opt.value as number)}
            classNamePrefix="react-select"
          />
          <Select
            isMulti
            options={agenteOptions}
            value={agenteOptions.filter(o => agentesSelecionados.includes(o.value))}
            onChange={sel => sel && sel.length > 0 && setAgentesSelecionados(sel.map(s => s.value))}
            classNamePrefix="react-select"
            styles={customStyles}
          />
          {agentesSelecionados.length === 1 ? (
            <img
              src={getAgenteImagePath(agentesSelecionados[0])}
              alt={agentesSelecionados[0]}
              className="h-64 w-[500px] object-contain rounded-lg shadow-md"
            />
          ) : (
            <div className="h-fit w-[308px] flex flex-wrap justify-center items-center gap-4 rounded-lg shadow-md bg-white p-2">
              {agentesSelecionados.map(ag => (
                <img
                  key={ag}
                  src={getAgenteFaceImagePath(ag)}
                  alt={ag}
                  className="h-20 w-20 object-contain rounded-full border border-gray-300"
                  title={ag}
                />
              ))}
            </div>
          )}
        </div>
        <div className="col-span-9 grid grid-cols-1 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-xl h-[600px]">
            <RatingTrendChart data={dados as ValorantData[]} agentes={agentesSelecionados} />
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-xl h-[600px]">
            <RatingAggressionScatter data={dados as ValorantData[]} agentes={agentesSelecionados} ano={anoSelecionado} />
          </div>
        </div>
      </main>
      <footer className="w-full text-center py-4 text-sm text-gray-500">Projeto de Visualização de Dados – PUCRS © 2025</footer>
    </div>
  );
};

export default AgentTrendsPage;
