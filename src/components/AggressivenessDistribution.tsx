import Plot from 'react-plotly.js';

type Props = {
  data: {
    Ano: number;
    Agents_stats: string;
    "First Kills Per Round": number;
  }[];
  agenteSelecionado: string;
  anoSelecionado: number;
};

const AggressivenessDistribution = ({ data, agenteSelecionado, anoSelecionado }: Props) => {
  const filtrado = data.filter(
    (d) =>
      d.Ano === anoSelecionado &&
      (agenteSelecionado === 'Todos' || d.Agents_stats === agenteSelecionado)
  );

  return (
    <Plot
      data={[
        {
          x: filtrado.map((d) => d["First Kills Per Round"]),
          type: 'histogram',
          marker: {
            color: '#4F46E5',
          },
          nbinsx: 30,
          opacity: 0.75,
        hovertemplate: 'Faixa: %{x}<br>Número de jogadores: %{y}<extra></extra>',
          

        },
      ]}
layout={{
    title: {
      text: 'Distribuição de Agressividade entre Jogadores (First Kills por Round)',
      font: {
        size: 20,
      },
      x: 0.5,
      xanchor: 'center'
    },
    xaxis: {
      title: {
        text: 'First Kills por Round (FKPR)',
        font: {
          size: 16,
        }
      }
    },
    yaxis: {
      title: {
        text: 'Número de Ocorrências (Jogadores)',
        font: {
          size: 16,
        }
      }
    },
    margin: { t: 80, b: 50, l: 60, r: 30 }, // espaço suficiente para o título
        bargap: 0.05,
      }}
      config={{ responsive: true }}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default AggressivenessDistribution;
