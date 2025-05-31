// src/components/HeatmapRating.tsx
import Plot from 'react-plotly.js';

type Props = {
  data: {
    Agents_stats: string;
    "Faixa de Agressividade": string;
    Rating_stats: number;
  }[];
  agenteSelecionado: string;
};

const ordemFaixas = [
  "0–0.05",
  "0.05–0.10",
  "0.10–0.15",
  "0.15–0.20",
  "0.20–0.30",
  "0.30–0.50",
];

const HeatmapRating = ({ data, agenteSelecionado }: Props) => {
  const todosAgentes = [
    'astra', 'breach', 'brimstone', 'chamber', 'clove',
    'cypher', 'fade', 'gekko', 'harbor', 'jett', 'kayo',
    'killjoy', 'neon', 'omen', 'phoenix', 'raze', 'reyna',
    'sage', 'skye', 'sova', 'viper', 'yoru', 'Todos'
  ];

  const agentes = [
    ...todosAgentes.filter(a => a === agenteSelecionado),
    ...todosAgentes.filter(a => a !== agenteSelecionado)
  ];

  const zMatrix = agentes.map((agente) =>
    ordemFaixas.map((faixa) => {
      const match = data.find(
        (d) => d.Agents_stats === agente && d["Faixa de Agressividade"] === faixa
      );
      return match ? match.Rating_stats : null;
    })
  );

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
      }
    },
    yaxis: {
      title: {
        text: 'Agente',
        font: { size: 16 }
      },
      autorange: 'reversed'
    }
  };

  return (
    <Plot
      data={
        agenteSelecionado === "Todos"
          ? [
              {
                z: zMatrix,
                x: ordemFaixas,
                y: agentes,
                type: 'heatmap',
                hoverongaps: false,
                colorscale: 'YlGnBu',
                colorbar: {
                  title: {
                    text: 'Rating Médio',
                    side: 'right'
                  },
                  tickvals: [0.2, 1.0, 1.2, 1.6],
                  ticktext: ['Fraco', '', '', 'Excelente'],
                  thickness: 15
                },
                hovertemplate:
                  'Agente: %{y}<br>Faixa: %{x}<br>Rating: %{z:.2f}<extra></extra>',
                opacity: 1.0,
              },
            ]
          : [
              {
                z: zMatrix,
                x: ordemFaixas,
                y: agentes,
                type: 'heatmap',
                hoverongaps: false,
                colorscale: 'YlGnBu',
                showscale: false,
                opacity: 0.3,
              },
              {
                z: [
                  ordemFaixas.map((faixa) => {
                    const match = data.find(
                      (d) =>
                        d.Agents_stats === agenteSelecionado &&
                        d["Faixa de Agressividade"] === faixa
                    );
                    return match ? match.Rating_stats : null;
                  }),
                ],
                x: ordemFaixas,
                y: [agenteSelecionado],
                type: 'heatmap',
                colorscale: 'YlGnBu',
                hoverongaps: false,
                colorbar: {
                  title: {
                    text: 'Rating Médio',
                    side: 'right',
                  },
                  tickvals: [0.2, 1.0, 1.2, 1.6],
                  ticktext: ['Fraco', '', '', 'Excelente'],
                  thickness: 15,
                },
                hovertemplate:
                  'Agente: %{y}<br>Faixa: %{x}<br>Rating: %{z:.2f}<extra></extra>',
                opacity: 1.0,
              },
            ]
      }
      layout={layoutConfig}
      useResizeHandler
      style={{ width: '100%', height: '100%' }}
      config={{ responsive: true }}
    />
  );
};

export default HeatmapRating;
