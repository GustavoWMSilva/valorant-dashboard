// src/components/HeatmapRating.tsx
import Plot from 'react-plotly.js';

type Props = {
  data: {
    Agents_stats: string;
    "Faixa de Agressividade": string;
    Rating_stats: number;
  }[];
  agentesSelecionados: string[];
};

const ordemFaixas = [
  "0–0.05",
  "0.05–0.10",
  "0.10–0.15",
  "0.15–0.20",
  "0.20–0.30",
  "0.30–0.50",
];

const HeatmapRating = ({ data, agentesSelecionados }: Props) => {
  // const todosAgentes = [
  //   'astra', 'breach', 'brimstone', 'chamber', 'clove',
  //   'cypher', 'fade', 'gekko', 'harbor', 'jett', 'kayo',
  //   'killjoy', 'neon', 'omen', 'phoenix', 'raze', 'reyna',
  //   'sage', 'skye', 'sova', 'viper', 'yoru', 'Todos'
  // ];

  const agentes = agentesSelecionados;

  // const zMatrix = agentes.map((agente) =>
  //   ordemFaixas.map((faixa) => {
  //     const match = data.find(
  //       (d) => d.Agents_stats === agente && d["Faixa de Agressividade"] === faixa
  //     );
  //     return match ? match.Rating_stats : null;
  //   })
  // );

  // Paleta de cores automática
  const palette = [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
    '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
  ];

  const agentColors = Object.fromEntries(
    agentesSelecionados.map((agente, index) => [agente, palette[index % palette.length]])
  );

  // Destaques por linha inteira usando shapes
  const highlightShapes = agentesSelecionados.map((agente) => {
    const yIndex = agentes.indexOf(agente);

    return {
      type: 'rect',
      xref: 'x',
      yref: 'y',
      x0: -0.5,
      x1: ordemFaixas.length - 0.5,

      y0: yIndex - 0.49,
      y1: yIndex + 0.49,
      line: {
        color: agentColors[agente] || '#000',
        width: 2,
      },
      fillcolor: 'rgba(0,0,0,0)',
      layer: 'above',
    };
  });

  const layoutConfig = {
    title: {
      text: '🔥 Heatmap: Rating Médio por Faixa de Agressividade e Agente',
      font: { size: 20 },
      x: 0.5,
      xanchor: 'center',
    },
    margin: { t: 80, b: 60, l: 100, r: 30 },
    xaxis: {
      title: {
        text: 'Faixa de Agressividade (First Kills por Round)',
        font: { size: 16 }
        
      },

      
    },
    yaxis: {
      title: {
        text: 'Agente',
        font: { size: 16 }
      },
      autorange: 'reversed',
      type: 'category',
      categoryorder: 'array',
      categoryarray: agentes,

    },
    shapes:  highlightShapes
  };

  const focusHeatmap = {
    z: agentesSelecionados.map((agente) =>
      ordemFaixas.map((faixa) => {
        const match = data.find(
          (d) => d.Agents_stats === agente && d["Faixa de Agressividade"] === faixa
        );
        return match ? match.Rating_stats : null;
      })
    ),
    x: ordemFaixas,
    y: agentesSelecionados,
    type: 'heatmap',
    colorscale: 'YlGnBu',
    hoverongaps: false,
    zmin: 0.2,
    zmax: 1.6,
    xgap: 1,
    ygap: 1,

    colorbar: {
      title: {
        text: 'Rating Médio',
        side: 'right',
      },
      tickvals: [0.2, 1.6],
      ticktext: ['Fraco', 'Excelente'],
      thickness: 15,
    },
    hovertemplate:
      'Agente: %{y}<br>Faixa: %{x}<br>Rating: %{z:.2f}<extra></extra>',
    opacity: 1.0,
  };

  return (
    <Plot
      data={[focusHeatmap]}
      layout={layoutConfig}
      useResizeHandler
      style={{ width: '100%', height: '100%' }}
      config={{ responsive: true }}
    />
  );
};

export default HeatmapRating;
