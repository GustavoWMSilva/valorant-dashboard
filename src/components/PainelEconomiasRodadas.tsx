import BauDeEconomia from './BauDeEconomia';
import Plot from 'react-plotly.js';
import { useState } from 'react';

interface EcoRoundData {
  RoundNumber?: number;
  ['Round Number']?: number;
  Type: string;
  Outcome: 'Win' | 'Loss';
}

interface Props {
  data: EcoRoundData[];
}

const tiposEconomia = [
  'Eco: 0-5k',
  'Semi-eco: 5-10k',
  'Semi-buy: 10-20k',
  'Full buy: 20k+',
];

const coresEconomia: Record<string, string> = {
  'Eco: 0-5k': '#3B82F6',
  'Semi-eco: 5-10k': '#10B981',
  'Semi-buy: 10-20k': '#F59E0B',
  'Full buy: 20k+': '#EF4444',
};

const PainelEconomiaRodadas = ({ data }: Props) => {
  const [economiaSelecionada, setEconomiaSelecionada] = useState<string | null>(null);

  const gerarLinha = (tipo: string) => {
    const rodadaStats: Record<number, { wins: number; total: number }> = {};

    data.forEach((d) => {
      const rawRound = d.RoundNumber ?? (d as any)['Round Number'];
      const r = Number(rawRound);

      if (d.Type === tipo && Number.isFinite(r) && r <= 25) {
        if (!rodadaStats[r]) rodadaStats[r] = { wins: 0, total: 0 };
        rodadaStats[r].total++;
        if (d.Outcome === 'Win') rodadaStats[r].wins++;
      }
    });

    const rodadas = Object.keys(rodadaStats)
      .map((r) => parseInt(r))
      .filter((r) => !isNaN(r))
      .sort((a, b) => a - b);

    const taxas = rodadas.map((r) => {
      const stats = rodadaStats[r];
      return stats && stats.total > 0 ? (stats.wins / stats.total) * 100 : 0;
    });

    if (rodadas.length === 0) {
      return {
        x: [0],
        y: [0],
        name: tipo,
        type: 'scatter',
        mode: 'lines',
        line: { color: '#ccc', width: 1 },
        marker: { opacity: 0 },
        showlegend: false,
      };
    }

    const isSelected = economiaSelecionada === tipo;

    return {
      x: rodadas,
      y: taxas,
      text: isSelected ? taxas.map((t) => Math.floor(t).toString()) : undefined,
      textposition: isSelected ? taxas.map((t) =>
      t >= 90 ? 'bottom center' : 'top center'
      ) : undefined,

      type: 'scatter',
      mode: isSelected ? 'lines+markers+text' : 'lines+markers',
      name: tipo,
      line: {
        color: coresEconomia[tipo] || '#888',
        width: isSelected ? 4 : 2,
        dash: 'solid',
      },
      marker: {
        size: isSelected ? 6 : 4,
        opacity: 1,
      },
      opacity: 1,
    };
  };

  return (
    <div className="flex flex-col xl:flex-row gap-4 items-start">
      {/* Baús de economia */}
      <div className="flex flex-col xl:flex-row gap-4 items-start min-h-[460px]">
        <BauDeEconomia
          economiaSelecionada={economiaSelecionada}
          setEconomiaSelecionada={setEconomiaSelecionada}
        />
      </div>

      {/* Gráfico de linhas */}
      <div className="flex-1 min-w-0 bg-white rounded-xl shadow-md p-4 h-[440px]">
        <h2 className="text-lg font-semibold mb-2 text-center">
          Tendência de Vitórias por Rodada
        </h2>
        <Plot
          data={tiposEconomia.map((tipo) => gerarLinha(tipo))}
          layout={{
            autosize: true,
            xaxis: {
              title: 'Nº da Rodada (1 a 25)',
              range: [1, 25],
              dtick: 1,
              automargin: true
            },
            yaxis: {
              title: 'Taxa de Vitória (%)',
              range: [0, 100],
              automargin: true
            },
            legend: { orientation: 'h', y: 1.08, x: 0.5, xanchor: 'center', yanchor: 'bottom' },
            margin: { t: 40, r: 20, l: 30, b: 40 },
          }}
          config={{ responsive: true }}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler
        />
      </div>
    </div>
  );
};

export default PainelEconomiaRodadas;
