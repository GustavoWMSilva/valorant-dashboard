import Plot from 'react-plotly.js';

interface Props {
  data: {
    Ano: number;
    Agents_stats: string;
    "First Kills Per Round": number;
  }[];
  agentesSelecionados: string[];
  anoSelecionado: number;
  tipoGrafico: 'histograma' | 'boxplot';
}

const AggressivenessCompare = ({ data, agentesSelecionados, anoSelecionado, tipoGrafico }: Props) => {
  const filtrado = data.filter(
    (d) =>
      d.Ano === anoSelecionado &&
      agentesSelecionados.includes(d.Agents_stats) &&
      d["First Kills Per Round"] !== null
  );

  const plotData = tipoGrafico === 'boxplot'
    ? agentesSelecionados.map((agente) => ({
        y: filtrado.filter(d => d.Agents_stats === agente).map(d => d["First Kills Per Round"]),
        name: agente,
        type: 'box',
        boxpoints: 'outliers',
        marker: { color: '#4F46E5' },
      }))
    : agentesSelecionados.map((agente) => ({
        x: filtrado.filter(d => d.Agents_stats === agente).map(d => d["First Kills Per Round"]),
        name: agente,
        type: 'histogram',
        opacity: 0.6,
        nbinsx: 25,
      }));

  return (
    <Plot
      data={plotData}
      layout={{
        title: tipoGrafico === 'boxplot'
          ? 'Boxplot de Agressividade por Agente'
          : 'Distribuição de Agressividade (Histograma)',
        xaxis: { title: 'First Kills Per Round', range: [0, 0.5] },
        yaxis: { title: tipoGrafico === 'boxplot' ? 'First Kills Per Round' : 'Número de Jogadores' },
        barmode: tipoGrafico === 'histograma' ? 'overlay' : undefined,
        boxmode: tipoGrafico === 'boxplot' ? 'group' : undefined,
        margin: { t: 60 },
      }}
      config={{ responsive: true }}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default AggressivenessCompare;
