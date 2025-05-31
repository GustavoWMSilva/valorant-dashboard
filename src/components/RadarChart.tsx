// src/components/RadarAggressionChart.tsx
import Plot from 'react-plotly.js';

type Props = {
data: {
Agents_stats: string             ;
"Faixa de Agressividade": string ;
Count: number                    ;
Ano: number                      ;
}[]                              ;
agentesSelecionados: string[]    ;  // múltiplos agentes
anoSelecionado: number           ;
}                                ;

const faixas = [
"0–0.05", "0.05–0.10", "0.10–0.15",
"0.15–0.20", "0.20–0.30", "0.30–0.50"
]                                     ;

const RadarAggressionChart = ({ data, agentesSelecionados, anoSelecionado }: Props) => {
const filtered = data.filter(d => d.Ano === anoSelecionado)                              ;

const traces = agentesSelecionados.map((agente) => {
const valores = faixas.map(faixa => {
const match = filtered.find(d =>
d.Agents_stats === agente &&
d["Faixa de Agressividade"] === faixa
)                                                    ;
return match ? match.Count : 0                       ;
})                                                   ;

return {
type: 'scatterpolar',
r: valores,
theta: faixas,
fill: 'toself',
name: agente,
}                     ;
})                    ;

return (
<Plot
data={traces}
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
}}
config={{ responsive: true }}
style={{ width: '100%', height: '100%' }}
/>
)                                                             ;
}                                                             ;

export default RadarAggressionChart ;
