import Plot from 'react-plotly.js';

interface Props {
  data: { role: string; count: number; avgRating: number }[];
}

const RoleDistributionChart = ({ data }: Props) => {
  return (
    <Plot
      data={[
        {
          x: data.map(d => d.role),
          y: data.map(d => d.count),
          type: 'bar',
          name: 'Jogadores',
        },
        {
          x: data.map(d => d.role),
          y: data.map(d => d.avgRating),
          type: 'scatter',
          mode: 'lines+markers',
          yaxis: 'y2',
          name: 'Rating médio',
        },
      ]}
      layout={{
        title: {
          text: 'Jogadores e Rating Médio por Função',
          font: { size: 20 },
          x: 0.5,
          xanchor: 'center',
        },
        yaxis: { title: 'Quantidade de Jogadores' },
        yaxis2: {
          title: 'Rating Médio',
          overlaying: 'y',
          side: 'right',
        },
        margin: { t: 80, b: 50, l: 60, r: 60 },
      }}
      useResizeHandler
      style={{ width: '100%', height: '100%' }}
      config={{ responsive: true }}
    />
  );
};

export default RoleDistributionChart;
