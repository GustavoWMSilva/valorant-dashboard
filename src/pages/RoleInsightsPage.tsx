import { useEffect, useState } from 'react';
import dados from '../data/grafico_valorant.json';
import Select from 'react-select';
import RoleDistributionChart from '../components/RoleDistributionChart';
import StackedAggressionBar from '../components/StackedAggressionBar';

interface RoleData {
  role: string;
  count: number;
  avgRating: number;
}

const RoleInsightsPage = () => {
  const anos = Array.from(new Set(dados.map(d => d.Ano))).sort();
  const [anoSelecionado, setAnoSelecionado] = useState<number>(2024);
  const [roleData, setRoleData] = useState<RoleData[]>([]);
  const [rolesDisponiveis, setRolesDisponiveis] = useState<string[]>([]);
  const [rolesSelecionadas, setRolesSelecionadas] = useState<string[]>([]);
  const [roleMap, setRoleMap] = useState<Record<string, string>>({});

  useEffect(() => {
    async function carregarDados() {
      const res = await fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true');
      const json = await res.json();
      const map: Record<string, string> = {};
      for (const ag of json.data) {
        if (ag.displayName && ag.role) {
          map[ag.displayName.toLowerCase()] = ag.role.displayName;
        }
      }
      setRoleMap(map);

      const dadosAno = dados.filter(d => d.Ano === anoSelecionado && d.Agents_stats !== 'Todos');
      const agg: Record<string, {count: number; ratingSum: number}> = {};
      for (const d of dadosAno) {
        const agente = d.Agents_stats.toLowerCase();
        const role = map[agente];
        if (!role) continue;
        if (!agg[role]) agg[role] = {count: 0, ratingSum: 0};
        agg[role].count += d.Count;
        agg[role].ratingSum += d.Rating_stats * d.Count;
      }
      const result = Object.entries(agg).map(([role, val]) => ({
        role,
        count: val.count,
        avgRating: val.ratingSum / val.count,
      }));
      setRoleData(result);
      setRolesDisponiveis(result.map(r => r.role));
      setRolesSelecionadas(result.map(r => r.role));
    }
    carregarDados();
  }, [anoSelecionado]);

  const aggressionData = dados.filter(d => {
    if (d.Ano !== anoSelecionado || d.Agents_stats === 'Todos') return false;
    const role = roleMap[d.Agents_stats.toLowerCase()];
    return role ? rolesSelecionadas.includes(role) : false;
  });

  const filteredRoles = roleData.filter(r => rolesSelecionadas.includes(r.role));

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-gray-100 to-indigo-50 flex flex-col">
      <header className="w-full bg-indigo-600 py-6 shadow-md">
        <h1 className="text-4xl font-bold text-white text-center">Insights por Função</h1>
      </header>
      <main className="flex-grow p-6 grid grid-cols-12 gap-6 max-w-screen-2xl mx-auto">
        <div className="col-span-3 bg-white rounded-2xl p-6 shadow-xl h-fit flex flex-col gap-4">
          <Select
            options={anos.map(ano => ({ value: ano, label: ano.toString() }))}
            value={{ value: anoSelecionado, label: anoSelecionado.toString() }}
            onChange={opt => opt && setAnoSelecionado(opt.value as number)}
            classNamePrefix="react-select"
          />
          <Select
            isMulti
            options={rolesDisponiveis.map(r => ({ value: r, label: r }))}
            value={rolesSelecionadas.map(r => ({ value: r, label: r }))}
            onChange={sel => sel && setRolesSelecionadas(sel.map(s => s.value))}
            classNamePrefix="react-select"
          />
        </div>
        <div className="col-span-9 grid grid-cols-1 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-xl h-[700px]">
            <RoleDistributionChart data={filteredRoles} />
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-xl h-[700px]">
            <StackedAggressionBar data={aggressionData} anoSelecionado={anoSelecionado} />
          </div>
        </div>
      </main>
      <footer className="w-full text-center py-4 text-sm text-gray-500">Projeto de Visualização de Dados – PUCRS © 2025</footer>
    </div>
  );
};

export default RoleInsightsPage;
