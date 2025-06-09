interface BauInfo {
  nome: string;
  preenchimento: number; // de 0 a 1
  taxaVitoria: number;   // em porcentagem
}

interface Props {
  economiaSelecionada: string | null;
  setEconomiaSelecionada: (tipo: string | null) => void;
}

const dados: BauInfo[] = [
  { nome: 'Eco: 0-5k', preenchimento: 0.1, taxaVitoria: 20 },
  { nome: 'Semi-eco: 5-10k', preenchimento: 0.3, taxaVitoria: 27 },
  { nome: 'Semi-buy: 10-20k', preenchimento: 0.6, taxaVitoria: 41 },
  { nome: 'Full buy: 20k+', preenchimento: 1, taxaVitoria: 61 },
];

const BauVisual = ({ preenchimento }: { preenchimento: number }) => {
  const total = 3;
  const cheios = Math.round(preenchimento * total);
  const vazios = total - cheios;

  return (
    <div className="flex text-2xl justify-center mb-2">
      {'💰'.repeat(cheios)}
      {'📦'.repeat(vazios)}
    </div>
  );
};

const BausDeEconomia = ({ economiaSelecionada, setEconomiaSelecionada }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {dados.map((bau) => {
        const selecionado = economiaSelecionada === bau.nome;
        return (
            <div
                key={bau.nome}
                onClick={() =>
                    setEconomiaSelecionada(selecionado ? null : bau.nome)
                }
                className={`h-[160px] cursor-pointer transition-colors p-4 rounded-xl shadow-md border-2 flex flex-col justify-between ${
                    selecionado ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                }`}
                >
            <h3 className="text-center font-semibold text-lg mb-2">{bau.nome}</h3>
            <BauVisual preenchimento={bau.preenchimento} />
            <p className="text-center text-sm">
              Taxa de Vitória: <strong>{bau.taxaVitoria}%</strong>
            </p>
            <p className={`text-center mt-2 font-medium transition-opacity duration-300 ${
                selecionado ? 'text-indigo-600 opacity-100' : 'text-transparent opacity-0'
                }`}>
                Clique novamente para desfocar
                </p>
          </div>
        );
      })}
    </div>
  );
};

export default BausDeEconomia;
