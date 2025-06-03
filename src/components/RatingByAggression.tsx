// src/components/RatingByAggression.tsx
import Plot from 'react-plotly.js';

type Props = {
  data: {
    Agent: string;
    "Faixa de Agressividade": string;
    Rating_stats: number;
    Count: number;
  }[];
  selectAgente: string;
  onAgenteClick: (agente: string) => void;
};

const RatingByAggression = ({ data, selectAgente, onAgenteClick }: Props) => {
  const agentsUnicos = Array.from(new Set(data.map(d => d.Agent)));
  const faixas = Array.from(new Set(data.map(d => d["Faixa de Agressividade"])));

  const traces = agentsUnicos.map(agent => {
    const dadosAgente = faixas.map(faixa => {
      const item = data.find(
        d => d.Agent === agent && d["Faixa de Agressividade"] === faixa
      );
      return {
        rating: item?.Rating_stats ?? 0,
        count: item?.Count ?? 0
      };
    });
    return {
      name: agent,
      x: faixas,
      y: dadosAgente.map(d => d.rating),
      text: dadosAgente.map(d => d.count),
      type: 'bar',
      opacity: !selectAgente || selectAgente === '' || agent === selectAgente ? 1 : 0.3,
      hovertemplate:
      'Agente: ' + agent + '<br>Faixa: %{x}<br>Rating Médio: %{y:.2f}<br>Qtd Jogadores: %{text}<extra></extra>',
    };
  });

  interface PlotData {
    name: string;
    x: string[];
    y: number[];
    text: number[];
    type: 'bar';
    opacity: number;
    hovertemplate: string;
  }

  interface PlotClickEvent {
    points: Array<{
      data: {
        name: string;
      };
    }>;
  }

  return (
    <Plot
      data={traces as PlotData[]}
      layout={{
        barmode: 'group',
        title: {
          text: 'Média de Rating por Faixa de Agressividade (por Agente)',
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
      onClick={(event: PlotClickEvent) => {
        const agenteClicado = event.points[0]?.data?.name;
        if (agenteClicado) {
          onAgenteClick(agenteClicado);
        }
      }}
      
      useResizeHandler
      style={{ width: '100%', height: '100%' }}
      config={{ responsive: true }}
    />
  );
};

export default RatingByAggression;
