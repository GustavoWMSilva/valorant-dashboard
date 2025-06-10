import Plot from 'react-plotly.js';

type Props = {
  data: {
    Agents_stats: string;
    "Faixa de Agressividade": string;
    Count: number;
  }[];
  anoSelecionado: number;
};

const faixaCores: { [faixa: string]: string } = {
  "0–0.05": "#AEC6CF",
  "0.05–0.10": "#FFB347",
  "0.10–0.15": "#77DD77",
  "0.15–0.20": "#FF6961",
  "0.20–0.30": "#CBAACB",
  "0.30–0.50": "#FDFD96"
};

const faixas = [
  "0–0.05", "0.05–0.10", "0.10–0.15",
  "0.15–0.20", "0.20–0.30", "0.30–0.50"
];

const StackedAggressionBar = ({ data, anoSelecionado }: Props) => {
  const agentes = Array.from(new Set(data.map(d => d.Agents_stats)));

  // Ordenar agentes por total de jogadores (soma dos counts)
  const agentesOrdenados = agentes.sort((a, b) => {
    const totalA = data.filter(d => d.Agents_stats === a).reduce((sum, d) => sum + d.Count, 0);
    const totalB = data.filter(d => d.Agents_stats === b).reduce((sum, d) => sum + d.Count, 0);
    return totalB - totalA;
  });

  const traces = faixas.map(faixa => ({
    x: agentesOrdenados,
    y: agentesOrdenados.map(agente => {
      const match = data.find(d =>
        d.Agents_stats === agente &&
        d["Faixa de Agressividade"] === faixa
      );
      return match ? match.Count : 0;
    }),
    name: faixa,
    type: 'bar',
    marker: { color: faixaCores[faixa] || "#ccc" }
  }));

  return (
    <Plot
      data={traces}
      layout={{
        barmode: 'stack',
        title: {
          text: `📊 Quantidade de Jogadores por Faixa de Agressividade – ${anoSelecionado}`,
          font: { size: 20 },
          x: 0.5,
          xanchor: 'center'
        },
        xaxis: {
          title: 'Agente',
          tickangle: -30,
          tickfont: { size: 12 }
        },
        yaxis: {
          title: 'Quantidade de Jogadores'
        },
        legend: {
          title: { text: 'Faixa de Agressividade' }
        },
        bargap: 0.35,
        margin: { t: 80, b: 120, l: 60, r: 30 }
      }}
      useResizeHandler
      style={{ width: '100%', height: '100%' }}
      config={{ responsive: true }}
    />
  );
};

export default StackedAggressionBar;
