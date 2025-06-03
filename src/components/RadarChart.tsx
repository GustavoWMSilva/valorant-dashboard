// src/components/RadarAggressionChart.tsx
import Plot from 'react-plotly.js';

type Props = {
  data: {
    Agents_stats: string;
    "Faixa de Agressividade": string;
    Count: number;
    Ano: number;
  }[];
  agentesSelecionados: string[];
  anoSelecionado: number;
  onAgenteClick: (agente: string) => void;
  agenteFocado: string;
};



const faixas = [
    "0–0.05", "0.05–0.10", "0.10–0.15",
    "0.15–0.20", "0.20–0.30", "0.30–0.50"
];

const RadarAggressionChart = ({ data, agentesSelecionados,agenteFocado, anoSelecionado,onAgenteClick }: Props) => {
    const filtered = data.filter(d => d.Ano === anoSelecionado);

    const traces = agentesSelecionados.map((agente) => {
  const valores = faixas.map(faixa => {
    const match = filtered.find(d =>
      d.Agents_stats === agente &&
      d["Faixa de Agressividade"] === faixa
    );
    return match ? match.Count : 0;
  });

  const isFocused = agente === agenteFocado ;

  return {
    type: 'scatterpolar',
    r: valores,
    theta: faixas,
    fill: 'toself',
    name: agente,
    line: {
      width: isFocused ? 4 : 2,
      dash: isFocused || agenteFocado === '' ? 'solid' : 'dot',
    },
    fillcolor: agenteFocado !== '' ? isFocused ?   'rgba(255, 99, 132, 0.4)' : 'rgba(0,0,0,0.1)' : '',
  };
});

  interface PlotClickEvent {
    points: Array<{
      data: {
        name: string;
      };
    }>;
  }




    interface PlotData {
        type: 'scatterpolar';
        r: number[];
        theta: string[];
        fill: string;
        name: string;
        line: {
            width: number;
            dash: string;
        };
        fillcolor: string;
    }

    interface PlotLayout {
        title: {
            text: string;
            font: { size: number };
            x: number;
            xanchor: string;
        };
        polar: {
            radialaxis: {
                visible: boolean;
                title: string;
            };
        };
        margin: {
            t: number;
            b: number;
        };
    }

    interface PlotConfig {
        responsive: boolean;
    }

    interface PlotClickEvent {
        points: Array<{
            data: {
                name: string;
            };
        }>;
    }

    interface PlotLegendClickEvent {
        data: PlotData[];
        curveNumber: number;
    }

    return (
            <Plot
                    data={traces as PlotData[]}
                    layout={{
                            title: {
                                    text: `Radar de Agressividade por Faixa – ${anoSelecionado}`,
                                    font: { size: 20 },
                                    x: 0.5,
                                    xanchor: 'center',
                            },
                            polar: {
                                    radialaxis: {
                                            visible: true,
                                            title: 'Qtd de Jogadores'
                                    }
                            },
                            margin: { t: 80, b: 50 }
                    } as Partial<PlotLayout>}
                    onClick={(event: PlotClickEvent) => {
                            const agente = event.points[0]?.data?.name;
                            if (agente) onAgenteClick(agente);
                    }}
                    onLegendClick={(event: PlotLegendClickEvent) => {
                            const agente = event?.data?.[event.curveNumber]?.name;
                            if (agente) onAgenteClick(agente);
                            return false; // mantém o trace visível
                    }}
                    config={{ responsive: true } as PlotConfig}
                    style={{ width: '100%', height: '100%' }}
            />
    );
};

export default RadarAggressionChart;
