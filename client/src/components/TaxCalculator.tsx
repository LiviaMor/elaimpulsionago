import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, TrendingDown, TrendingUp, Info, CheckCircle2, AlertCircle, Search } from "lucide-react";
import { atividades, type Atividade } from "@/data/atividades-mei";

// Tabelas do Simples Nacional 2024 - Anexo I (Comércio)
const simplesAnexoI = [
  { limite: 180000, aliquota: 0.04, deducao: 0 },
  { limite: 360000, aliquota: 0.073, deducao: 5940 },
  { limite: 720000, aliquota: 0.095, deducao: 13860 },
  { limite: 1800000, aliquota: 0.107, deducao: 22500 },
  { limite: 3600000, aliquota: 0.143, deducao: 87300 },
  { limite: 4800000, aliquota: 0.19, deducao: 378000 },
];

// Tabelas do Simples Nacional 2024 - Anexo III (Serviços)
const simplesAnexoIII = [
  { limite: 180000, aliquota: 0.06, deducao: 0 },
  { limite: 360000, aliquota: 0.112, deducao: 9360 },
  { limite: 720000, aliquota: 0.135, deducao: 17640 },
  { limite: 1800000, aliquota: 0.16, deducao: 35640 },
  { limite: 3600000, aliquota: 0.21, deducao: 125640 },
  { limite: 4800000, aliquota: 0.33, deducao: 648000 },
];

function calcularSimples(faturamentoAnual: number, tipo: "comercio" | "servicos"): number {
  const tabela = tipo === "comercio" ? simplesAnexoI : simplesAnexoIII;
  const faixa = tabela.find((f) => faturamentoAnual <= f.limite);
  if (!faixa) return 0;
  const aliquotaEfetiva = (faturamentoAnual * faixa.aliquota - faixa.deducao) / faturamentoAnual;
  return Math.max(aliquotaEfetiva, 0);
}

function calcularLucroPresumido(
  faturamentoAnual: number,
  tipo: "comercio" | "servicos",
  folhaAnual: number = 0
): { total: number; detalhes: { nome: string; valor: number; aliquota: number }[] } {
  const basePresuncaoIR = tipo === "comercio" ? 0.08 : 0.32;
  const basePresuncaoCSLL = tipo === "comercio" ? 0.12 : 0.32;

  const irpjBase = faturamentoAnual * basePresuncaoIR;
  const csllBase = faturamentoAnual * basePresuncaoCSLL;

  const irpj = irpjBase * 0.15;
  const adicionalIRPJ = Math.max(0, (irpjBase - 240000) * 0.1);
  const csll = csllBase * 0.09;
  const pis = faturamentoAnual * 0.0065;
  const cofins = faturamentoAnual * 0.03;
  const iss = tipo === "servicos" ? faturamentoAnual * 0.03 : 0;
  const icms = tipo === "comercio" ? faturamentoAnual * 0.04 : 0;
  const encargos = folhaAnual * 0.358;

  const total = irpj + adicionalIRPJ + csll + pis + cofins + iss + icms + encargos;

  return {
    total,
    detalhes: [
      { nome: "IRPJ", valor: irpj + adicionalIRPJ, aliquota: ((irpj + adicionalIRPJ) / faturamentoAnual) * 100 },
      { nome: "CSLL", valor: csll, aliquota: (csll / faturamentoAnual) * 100 },
      { nome: "PIS", valor: pis, aliquota: 0.65 },
      { nome: "COFINS", valor: cofins, aliquota: 3.0 },
      ...(tipo === "servicos" ? [{ nome: "ISS (média)", valor: iss, aliquota: 3.0 }] : []),
      ...(tipo === "comercio" ? [{ nome: "ICMS (líquido)", valor: icms, aliquota: 4.0 }] : []),
      ...(folhaAnual > 0 ? [{ nome: "Encargos s/ folha (INSS+FGTS)", valor: encargos, aliquota: 35.8 }] : []),
    ],
  };
}

function calcularLucroReal(
  faturamentoAnual: number,
  tipo: "comercio" | "servicos",
  margemLucro: number = 0.15,
  folhaAnual: number = 0
): { total: number; detalhes: { nome: string; valor: number; aliquota: number }[] } {
  const lucroReal = Math.max(faturamentoAnual * margemLucro - folhaAnual, 0);

  const irpj = lucroReal * 0.15;
  const adicionalIRPJ = Math.max(0, (lucroReal - 240000) * 0.1);
  const csll = lucroReal * 0.09;
  const pis = faturamentoAnual * 0.0165;
  const cofins = faturamentoAnual * 0.076;
  const iss = tipo === "servicos" ? faturamentoAnual * 0.03 : 0;
  const icms = tipo === "comercio" ? faturamentoAnual * 0.04 : 0;
  const encargos = folhaAnual * 0.358;

  const total = irpj + adicionalIRPJ + csll + pis + cofins + iss + icms + encargos;

  return {
    total,
    detalhes: [
      { nome: "IRPJ", valor: irpj + adicionalIRPJ, aliquota: ((irpj + adicionalIRPJ) / faturamentoAnual) * 100 },
      { nome: "CSLL", valor: csll, aliquota: (csll / faturamentoAnual) * 100 },
      { nome: "PIS (não-cumulativo)", valor: pis, aliquota: 1.65 },
      { nome: "COFINS (não-cumulativo)", valor: cofins, aliquota: 7.6 },
      ...(tipo === "servicos" ? [{ nome: "ISS (média)", valor: iss, aliquota: 3.0 }] : []),
      ...(tipo === "comercio" ? [{ nome: "ICMS (líquido)", valor: icms, aliquota: 4.0 }] : []),
      ...(folhaAnual > 0 ? [{ nome: "Encargos s/ folha (INSS+FGTS)", valor: encargos, aliquota: 35.8 }] : []),
    ],
  };
}

function calcularMEI(tipo: "comercio" | "servicos" | "industria"): { total: number; mensal: number; detalhes: { nome: string; valor: number; aliquota: number }[] } {
  const salarioMinimo = 1518;
  const inss = salarioMinimo * 0.05;
  const icms = tipo === "comercio" || tipo === "industria" ? 1 : 0;
  const iss = tipo === "servicos" ? 5 : 0;
  const mensal = inss + icms + iss;
  const anual = mensal * 12;

  return {
    total: anual,
    mensal,
    detalhes: [
      { nome: "INSS (5% do salário mínimo)", valor: inss * 12, aliquota: 5 },
      ...(icms > 0 ? [{ nome: "ICMS (fixo)", valor: icms * 12, aliquota: 0 }] : []),
      ...(iss > 0 ? [{ nome: "ISS (fixo)", valor: iss * 12, aliquota: 0 }] : []),
    ],
  };
}

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatPercent = (value: number) =>
  `${(value * 100).toFixed(2)}%`;

export default function TaxCalculator() {
  const [faturamento, setFaturamento] = useState("");
  const [tipo, setTipo] = useState<"comercio" | "servicos">("comercio");
  const [numFuncionarios, setNumFuncionarios] = useState("");
  const [mediaSalarial, setMediaSalarial] = useState("");

  const [atividadeSearch, setAtividadeSearch] = useState("");
  const [atividadeSelecionada, setAtividadeSelecionada] = useState<Atividade | null>(null);
  const [showAtivDropdown, setShowAtivDropdown] = useState(false);
  const ativRef = useRef<HTMLDivElement>(null);

  const atividadesFiltradas = atividadeSearch.length >= 2
    ? atividades.filter((a) => a.nome.toLowerCase().includes(atividadeSearch.toLowerCase())).slice(0, 8)
    : [];

  useEffect(() => {
    if (atividadesFiltradas.length > 0 && atividadeSearch.length >= 2) setShowAtivDropdown(true);
  }, [atividadeSearch]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ativRef.current && !ativRef.current.contains(e.target as Node)) setShowAtivDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const [resultado, setResultado] = useState<null | {
    simplesAliquota: number;
    simplesTotal: number;
    lpTotal: number;
    lpDetalhes: { nome: string; valor: number; aliquota: number }[];
    lrTotal: number;
    lrDetalhes: { nome: string; valor: number; aliquota: number }[];
    melhorOpcao: "mei" | "simples" | "presumido" | "real";
    economia: number;
    simplesDisponivel: boolean;
    meiDisponivel: boolean;
    meiTotal: number;
    meiMensal: number;
    meiDetalhes: { nome: string; valor: number; aliquota: number }[];
    faturamentoAnual: number;
  }>(null);

  const handleSimular = () => {
    const fat = parseFloat(faturamento.replace(/\D/g, "")) / 100;
    if (!fat || fat <= 0) return;

    const faturamentoAnual = fat * 12;
    const nFunc = parseInt(numFuncionarios) || 0;
    const salMedio = parseFloat(mediaSalarial.replace(/\D/g, "")) / 100 || 0;
    const folhaAnual = nFunc * salMedio * 12;
    const tipoAtiv = atividadeSelecionada?.tipo === "industria" ? "comercio" : (atividadeSelecionada?.tipo ?? tipo);
    const simplesDisponivel = faturamentoAnual <= 4800000;
    const meiDisponivel = faturamentoAnual <= 81000 && nFunc <= 1 && (atividadeSelecionada?.mei ?? true);

    const simplesAliquota = simplesDisponivel ? calcularSimples(faturamentoAnual, tipoAtiv as "comercio" | "servicos") : 0;
    const simplesTotal = simplesDisponivel ? faturamentoAnual * simplesAliquota : 0;
    const { total: lpTotal, detalhes: lpDetalhes } = calcularLucroPresumido(faturamentoAnual, tipoAtiv as "comercio" | "servicos", folhaAnual);
    const { total: lrTotal, detalhes: lrDetalhes } = calcularLucroReal(faturamentoAnual, tipoAtiv as "comercio" | "servicos", 0.15, folhaAnual);
    const mei = calcularMEI(atividadeSelecionada?.tipo ?? "servicos");

    const opcoes: { nome: "mei" | "simples" | "presumido" | "real"; valor: number }[] = [
      { nome: "presumido", valor: lpTotal },
      { nome: "real", valor: lrTotal },
    ];
    if (simplesDisponivel) opcoes.push({ nome: "simples", valor: simplesTotal });
    if (meiDisponivel) opcoes.push({ nome: "mei", valor: mei.total });
    const melhor = opcoes.reduce((a, b) => (a.valor < b.valor ? a : b));
    const economia = Math.abs(Math.max(...opcoes.map((o) => o.valor)) - melhor.valor);

    setResultado({
      simplesAliquota, simplesTotal, lpTotal, lpDetalhes,
      lrTotal, lrDetalhes,
      melhorOpcao: melhor.nome,
      economia,
      simplesDisponivel,
      meiDisponivel,
      meiTotal: mei.total,
      meiMensal: mei.mensal,
      meiDetalhes: mei.detalhes,
      faturamentoAnual,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Faturamento Mensal */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Faturamento Mensal (R$)
            </label>
            <input
              type="text"
              value={faturamento}
              onChange={(e) => setFaturamento(e.target.value)}
              placeholder="0,00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Tipo de Atividade */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tipo de Atividade
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as "comercio" | "servicos")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="comercio">Comércio</option>
              <option value="servicos">Serviços</option>
            </select>
          </div>

          {/* Busca de Atividade */}
          <div ref={ativRef} className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Buscar Atividade (MEI)
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                value={atividadeSearch}
                onChange={(e) => setAtividadeSearch(e.target.value)}
                placeholder="Ex: Cabeleireiro, Programador..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <AnimatePresence>
              {showAtivDropdown && atividadesFiltradas.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto"
                >
                  {atividadesFiltradas.map((ativ, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setAtividadeSelecionada(ativ);
                        setAtividadeSearch(ativ.nome);
                        setShowAtivDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-orange-50 transition border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{ativ.nome}</div>
                      <div className="text-xs text-gray-500">
                        {ativ.tipo} {ativ.mei && "• MEI permitido"}
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            {atividadeSelecionada && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700 flex items-center gap-2">
                <CheckCircle2 size={16} />
                {atividadeSelecionada.nome}
              </div>
            )}
          </div>

          {/* Número de Funcionários */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Número de Funcionários
            </label>
            <input
              type="number"
              value={numFuncionarios}
              onChange={(e) => setNumFuncionarios(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Média Salarial */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Média Salarial (R$)
            </label>
            <input
              type="text"
              value={mediaSalarial}
              onChange={(e) => setMediaSalarial(e.target.value)}
              placeholder="0,00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <button
          onClick={handleSimular}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
        >
          <Calculator size={20} />
          Simular Tributos
        </button>
      </div>

      {/* Resultados */}
      <AnimatePresence>
        {resultado && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-8 space-y-6"
          >
            {/* Melhor Opção */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="text-green-600" size={24} />
                <h3 className="text-xl font-bold text-green-900">Melhor Opção</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-green-700 mb-1">Regime Recomendado</p>
                  <p className="text-2xl font-bold text-green-900 capitalize">
                    {resultado.melhorOpcao === "mei" ? "MEI" : resultado.melhorOpcao === "simples" ? "Simples Nacional" : resultado.melhorOpcao === "presumido" ? "Lucro Presumido" : "Lucro Real"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-green-700 mb-1">Economia Anual</p>
                  <p className="text-2xl font-bold text-green-900">{formatCurrency(resultado.economia)}</p>
                </div>
                <div>
                  <p className="text-sm text-green-700 mb-1">Faturamento Anual</p>
                  <p className="text-2xl font-bold text-green-900">{formatCurrency(resultado.faturamentoAnual)}</p>
                </div>
              </div>
            </div>

            {/* Comparativo de Regimes */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* MEI */}
              {resultado.meiDisponivel && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-200"
                >
                  <h4 className="text-lg font-bold text-gray-900 mb-4">MEI</h4>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Tributo Mensal</p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(resultado.meiMensal)}</p>
                    <p className="text-xs text-gray-500 mt-1">Anual: {formatCurrency(resultado.meiTotal)}</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    {resultado.meiDetalhes.map((detalhe, idx) => (
                      <div key={idx} className="flex justify-between text-gray-700">
                        <span>{detalhe.nome}</span>
                        <span className="font-semibold">{formatCurrency(detalhe.valor / 12)}/mês</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Simples Nacional */}
              {resultado.simplesDisponivel && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-200"
                >
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Simples Nacional</h4>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Alíquota Efetiva</p>
                    <p className="text-2xl font-bold text-purple-600">{formatPercent(resultado.simplesAliquota)}</p>
                    <p className="text-xs text-gray-500 mt-1">Anual: {formatCurrency(resultado.simplesTotal)}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded text-sm text-purple-700">
                    Regime progressivo com alíquotas de 4% a 33% conforme faturamento
                  </div>
                </motion.div>
              )}

              {/* Lucro Presumido */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-200"
              >
                <h4 className="text-lg font-bold text-gray-900 mb-4">Lucro Presumido</h4>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Tributo Anual</p>
                  <p className="text-2xl font-bold text-orange-600">{formatCurrency(resultado.lpTotal)}</p>
                  <p className="text-xs text-gray-500 mt-1">Alíquota: ~{((resultado.lpTotal / resultado.faturamentoAnual) * 100).toFixed(2)}%</p>
                </div>
                <div className="space-y-2 text-sm max-h-32 overflow-y-auto">
                  {resultado.lpDetalhes.map((detalhe, idx) => (
                    <div key={idx} className="flex justify-between text-gray-700">
                      <span>{detalhe.nome}</span>
                      <span className="font-semibold">{formatCurrency(detalhe.valor)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Lucro Real */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg border-2 border-pink-200"
              >
                <h4 className="text-lg font-bold text-gray-900 mb-4">Lucro Real</h4>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Tributo Anual</p>
                  <p className="text-2xl font-bold text-pink-600">{formatCurrency(resultado.lrTotal)}</p>
                  <p className="text-xs text-gray-500 mt-1">Alíquota: ~{((resultado.lrTotal / resultado.faturamentoAnual) * 100).toFixed(2)}%</p>
                </div>
                <div className="space-y-2 text-sm max-h-32 overflow-y-auto">
                  {resultado.lrDetalhes.map((detalhe, idx) => (
                    <div key={idx} className="flex justify-between text-gray-700">
                      <span>{detalhe.nome}</span>
                      <span className="font-semibold">{formatCurrency(detalhe.valor)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Dica */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 flex gap-4">
              <Info className="text-blue-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <h4 className="font-bold text-blue-900 mb-2">Dica Importante</h4>
                <p className="text-sm text-blue-800">
                  Esta simulação é educativa. Consulte um contador ou especialista em tributação para orientação profissional específica para seu negócio.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
