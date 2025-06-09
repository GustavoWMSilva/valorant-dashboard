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
          marker: { line: { width: 2, color: '#fff' } },
        },
        {
          x: data.map(d => d.role),
          y: data.map(d => d.avgRating),
          type: 'scatter',
          mode: 'lines+markers',
          yaxis: 'y2',
          name: 'Rating médio',
          marker: { size: 14 },
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
        bargap: 0.35,
        legend: {
          x: 0.5,
          y: -0.2,
          xanchor: 'center',
          yanchor: 'top',
          orientation: 'h',
          bgcolor: 'rgba(255,255,255,0.7)',
          bordercolor: '#ccc',
          borderwidth: 1
        },
      }}
      useResizeHandler
      style={{ width: '100%', height: '100%' }}
      config={{ responsive: true }}
    />
  );
};

export default RoleDistributionChart;
