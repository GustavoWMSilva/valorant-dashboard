// src/components/HeatmapRating.tsx
import Plot from 'react-plotly.js';

type Props = {
  data: {
    Agents_stats: string;
    "Faixa de Agressividade": string;
    Rating_stats: number;
  }[];
  agentesSelecionados: string[];
  agenteFocado: string | null;
  onAgenteClick: (agente: string) => void;
};

const ordemFaixas = [
  "0–0.05",
  "0.05–0.10",
  "0.10–0.15",
  "0.15–0.20",
  "0.20–0.30",
  "0.30–0.50",
];

const HeatmapRating = ({ data, agentesSelecionados, agenteFocado, onAgenteClick }: Props) => {
  const agentesComDados = agentesSelecionados.filter((agente) =>
    data.some(
      (d) =>
        d.Agents_stats === agente &&
        ordemFaixas.includes(d["Faixa de Agressividade"])
    )
  );

  const palette = [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
    '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
  ];

  const agentColors = Object.fromEntries(
    agentesComDados.map((agente, index) => [agente, palette[index % palette.length]])
  );

  const zMatrix = agentesComDados.map((agente) =>
    ordemFaixas.map((faixa) => {
      const match = data.find(
        (d) => d.Agents_stats === agente && d["Faixa de Agressividade"] === faixa
      );
      return match ? match.Rating_stats : null;
    })
  );

  const opacityMask = agentesComDados.map((agente) =>
    ordemFaixas.map(() =>
      agenteFocado ? (agente === agenteFocado ? 1.0 : 0.2) : 1.0
    )
  );

  const zVisual = zMatrix.map((linha, i) =>
    linha.map((val, j) =>
      val !== null ? val * opacityMask[i][j] : null
    )
  );

  const focusHeatmap = {
    z: zVisual,
    x: ordemFaixas,
    y: agentesComDados,
    type: 'heatmap',
colorscale: [
  [0, 'rgb(255,255,229)'],        // era o 1
  [0.1111111111, 'rgb(255,255,204)'],
  [0.2222222222, 'rgb(237,248,217)'],
  [0.3333333333, 'rgb(199,233,180)'],
  [0.4444444444, 'rgb(127,205,187)'],
  [0.5555555555, 'rgb(65,182,196)'],
  [0.6666666666, 'rgb(29,145,192)'],
  [0.7777777777, 'rgb(34,94,168)'],
  [0.8888888888, 'rgb(37,52,148)'],
  [1, 'rgb(8,29,88)']             // era o 0
]
    ,
    hoverongaps: false,
    zmin: 0.2,
    zmax: 1.6,
    xgap: 1,
    ygap: 1,
    showscale: true,
    hovertemplate:
      'Agente: %{y}<br>Faixa: %{x}<br>Rating: %{z:.2f}<extra></extra>',
  };
const highlightShapes = agentesSelecionados.map((agente) => {
    const yIndex = agentesComDados.indexOf(agente);

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
        width: 3,
      },
      fillcolor: 'rgba(0,0,0,0)',
      layer: 'above',
    };
});
  // const highlightShapes = agenteFocado ? [
  //   {
  //     type: 'rect',
  //     xref: 'x',
  //     yref: 'y',
  //     x0: -0.5,
  //     x1: ordemFaixas.length - 0.5,
  //     y0: agentesComDados.indexOf(agenteFocado) - 0.49,
  //     y1: agentesComDados.indexOf(agenteFocado) + 0.49,
  //     line: {
  //       color: agentColors[agente] || '#000',
  //       width: 3,
  //     },
  //     fillcolor: 'rgba(0,0,0,0)',
  //     layer: 'above',
  //   },
  // ] : [];

  const opacidade = agenteFocado ? 1.0 : 0.3;

  const layoutConfig = {
    title: {
      text: 'Heatmap: Rating Médio por Faixa de Agressividade e Agente',
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
      categoryarray: agentesComDados,
    },
    shapes: highlightShapes,
    opacity: opacidade,
  };

  return (
    <Plot
      data={[focusHeatmap] as Partial<Plotly.PlotData>[]}
      layout={layoutConfig as Partial<Plotly.Layout>}
      onClick={(event: Readonly<Plotly.PlotMouseEvent>) => {
        const agente: string | undefined = event.points?.[0]?.y as string | undefined;
        if (agente) onAgenteClick(agente);
      }}
      useResizeHandler
      style={{ width: '100%', height: '100%' }}
      config={{ responsive: true } as Partial<Plotly.Config>}
    />
  );
};

export default HeatmapRating;
