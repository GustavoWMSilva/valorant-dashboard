import type { FC } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type Props = {
  data: {
    Mapa: string;
    attacker: number;
    defender: number;
  }[];
};

const MapaWinRateChart: FC<Props> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} barGap={8}>
        <XAxis dataKey="Mapa" />
        <YAxis
          label={{
            value: 'Taxa de Vitória (%)',
            angle: -90,
            position: 'insideLeft',
            offset: 10,
            style: { textAnchor: 'middle' }
          }}
          unit="%"
        />
        <Tooltip />
        <Legend />
        <Bar dataKey="attacker" fill="#1f77b4" name="Atacante" />
        <Bar dataKey="defender" fill="#ff7f0e" name="Defensor" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MapaWinRateChart;