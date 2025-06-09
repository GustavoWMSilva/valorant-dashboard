import Plot from 'react-plotly.js';

interface Entry {
  Ano: number;
  Agents_stats: string;
  "Faixa de Agressividade": string;
  Rating_stats: number;
  Count: number;
}

interface Props {
  data: Entry[];
  agentes: string[];
}

const RatingTrendChart = ({ data, agentes }: Props) => {
  const anos = Array.from(new Set(data.map(d => d.Ano))).sort();

  const traces = agentes.map(agente => {
    const ratings = anos.map(ano => {
      const registros = data.filter(
        d => d.Agents_stats === agente && d.Ano === ano
      );
      const total = registros.reduce((sum, r) => sum + r.Count, 0);
      const weighted = registros.reduce(
        (sum, r) => sum + r.Rating_stats * r.Count,
        0
      );
      return total > 0 ? weighted / total : null;
    });
    return {
      x: anos,
      y: ratings,
      type: 'scatter',
      mode: 'lines+markers',
      name: agente,
    };
  });

  return (
    <Plot
      data={traces as Partial<Plotly.PlotData>[]}
      layout={{
        title: {
          text: 'Evolução do Rating Médio por Agente',
          font: { size: 20 },
          x: 0.5,
          xanchor: 'center',
        },
        xaxis: { title: 'Ano' },
        yaxis: { title: 'Rating Médio' },
        margin: { t: 80, b: 50, l: 60, r: 30 },
      }}
      useResizeHandler
      style={{ width: '100%', height: '100%' }}
      config={{ responsive: true }}
    />
  );
};

export default RatingTrendChart;
