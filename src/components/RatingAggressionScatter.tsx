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
  ano: number;
}

const faixaValores: Record<string, number> = {
  '0–0.05': 0.025,
  '0.05–0.10': 0.075,
  '0.10–0.15': 0.125,
  '0.15–0.20': 0.175,
  '0.20–0.30': 0.25,
  '0.30–0.50': 0.4,
};

const RatingAggressionScatter = ({ data, agentes, ano }: Props) => {
  const filtrado = data.filter(
    d => d.Ano === ano && agentes.includes(d.Agents_stats)
  );

  const traces = agentes.map(agente => {
    const entradas = filtrado.filter(f => f.Agents_stats === agente);
    return {
      x: entradas.map(e => faixaValores[e['Faixa de Agressividade']] ?? 0),
      y: entradas.map(e => e.Rating_stats),
      mode: 'markers',
      type: 'scatter',
      name: agente,
      marker: {
        size: entradas.map(e => Math.max(10, Math.sqrt(e.Count) * 2)),
        sizemode: 'area',
        sizeref: 2.0 * Math.max(...entradas.map(e => Math.sqrt(e.Count) * 2)) / 40**2,
        sizemin: 10
      },
      text: entradas.map(e =>
        `Agente: ${agente}<br>Faixa: ${e['Faixa de Agressividade']}<br>Rating: ${e.Rating_stats.toFixed(3)}<br>Jogos: ${e.Count}`
      ),
      hoverinfo: 'text',
    };
  });

  return (
    <Plot
      data={traces as Partial<Plotly.PlotData>[]}
      layout={{
        title: {
          text: `Rating vs. Agressividade – ${ano}`,
          font: { size: 20 },
          x: 0.5,
          xanchor: 'center',
        },
        xaxis: { title: 'First Kills por Round (valor médio)' },
        yaxis: { title: 'Rating Médio' },
        margin: { t: 80, b: 60, l: 60, r: 30 },
      }}
      useResizeHandler
      style={{ width: '100%', height: '100%' }}
      config={{ responsive: true }}
    />
  );
};

export default RatingAggressionScatter;
