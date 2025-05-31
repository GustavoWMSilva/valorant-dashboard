// src/components/RatingByAggression.tsx
import Plot from 'react-plotly.js';

type Props = {
  data: {
    "Faixa de Agressividade": string;
    Rating_stats: number;
    Count: number;
  }[];
};

const RatingByAggression = ({ data }: Props) => {
  return (
    <Plot
      data={[
        {
          x: data.map(d => d["Faixa de Agressividade"]),
          y: data.map(d => d.Rating_stats),
          text: data.map(d => d.Count),
          type: 'bar',
          marker: { color: '#636EFA' },
          hovertemplate:
            'Faixa: %{x}<br>Rating Médio: %{y:.2f}<br>Qtd Jogadores: %{text}<extra></extra>',
        }
      ]}
      layout={{
        title: {
          text: '📊 Média de Rating por Faixa de Agressividade',
          font: { size: 20 },
          x: 0.5,
          xanchor: 'center',
        },
        xaxis: {
          title: {
            text: 'Faixa de Agressividade (First Kills por Round)',
            font: { size: 16 },
          }
        },
        yaxis: {
          title: {
            text: 'Rating Médio',
            font: { size: 16 },
          }
        },
        margin: { t: 80, b: 60, l: 80, r: 30 }
      }}
      useResizeHandler
      style={{ width: '100%', height: '100%' }}
      config={{ responsive: true }}
    />
  );
};

export default RatingByAggression;
