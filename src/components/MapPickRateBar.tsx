import Plot from 'react-plotly.js';

interface Entry {
  Map: string;
  PickRate: number;
}

interface Props {
  data: Entry[];
}

const MapPickRateBar = ({ data }: Props) => (
  <Plot
    data={[{
      x: data.map(d => d.Map),
      y: data.map(d => d.PickRate),
      type: 'bar',
      marker: { color: 'indigo' },
    }]}
    layout={{
      title: {
        text: 'Pick Rate por Mapa',
        font: { size: 20 },
        x: 0.5,
        xanchor: 'center',
      },
      xaxis: { title: 'Mapa' },
      yaxis: { title: 'Pick Rate' },
      margin: { t: 80, b: 50, l: 60, r: 30 },
    }}
    useResizeHandler
    style={{ width: '100%', height: '100%' }}
    config={{ responsive: true }}
  />
);

export default MapPickRateBar;
