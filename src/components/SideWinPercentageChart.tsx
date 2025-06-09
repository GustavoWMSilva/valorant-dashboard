import Plot from 'react-plotly.js';

interface Entry {
  Map: string;
  AttackerSideWinPercentage: number;
  DefenderSideWinPercentage: number;
}

interface Props {
  data: Entry[];
}

const SideWinPercentageChart = ({ data }: Props) => (
  <Plot
    data={[
      {
        x: data.map(d => d.Map),
        y: data.map(d => d.AttackerSideWinPercentage),
        type: 'bar',
        name: 'Ataque',
      },
      {
        x: data.map(d => d.Map),
        y: data.map(d => d.DefenderSideWinPercentage),
        type: 'bar',
        name: 'Defesa',
      },
    ]}
    layout={{
      barmode: 'group',
      title: {
        text: 'Taxa de Vitórias por Lado',
        font: { size: 20 },
        x: 0.5,
        xanchor: 'center',
      },
      xaxis: { title: 'Mapa' },
      yaxis: { title: 'Porcentagem de Vitórias' },
      margin: { t: 80, b: 50, l: 60, r: 30 },
    }}
    useResizeHandler
    style={{ width: '100%', height: '100%' }}
    config={{ responsive: true }}
  />
);

export default SideWinPercentageChart;
