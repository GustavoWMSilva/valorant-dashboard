import Plot from 'react-plotly.js';

interface Entry {
  Map: string;
  TotalWinsByMap: number;
  TotalLossByMap: number;
}

interface Props {
  data: Entry[];
}

const MapWinLossChart = ({ data }: Props) => (
  <Plot
    data={[
      {
        x: data.map(d => d.Map),
        y: data.map(d => d.TotalWinsByMap),
        type: 'bar',
        name: 'Vitórias',
      },
      {
        x: data.map(d => d.Map),
        y: data.map(d => d.TotalLossByMap),
        type: 'bar',
        name: 'Derrotas',
      },
    ]}
    layout={{
      barmode: 'stack',
      title: {
        text: 'Vitórias e Derrotas por Mapa',
        font: { size: 20 },
        x: 0.5,
        xanchor: 'center',
      },
      xaxis: { title: 'Mapa' },
      yaxis: { title: 'Partidas' },
      margin: { t: 80, b: 50, l: 60, r: 30 },
    }}
    useResizeHandler
    style={{ width: '100%', height: '100%' }}
    config={{ responsive: true }}
  />
);

export default MapWinLossChart;
