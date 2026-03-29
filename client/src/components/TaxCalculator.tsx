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

function calcularMEI(tipo: "comercio" | "servicos" | "industria" | "comercio_servicos"): { total: number; mensal: number; detalhes: { nome: string; valor: number; aliquota: number }[] } {
  const salarioMinimo = 1518;
  const inss = salarioMinimo * 0.05; // R$ 75,90

  // Valores fixos conforme tipo de atividade (2025)
  let icms = 0;
  let iss = 0;

  if (tipo === "comercio" || tipo === "industria") {
    icms = 1; // R$ 1,00 fixo
  } else if (tipo === "servicos") {
    iss = 5; // R$ 5,00 fixo
  } else if (tipo === "comercio_servicos") {
    icms = 1; // R$ 1,00 fixo
    iss = 5; // R$ 5,00 fixo
  }

  const mensal = inss + icms + iss;
  const anual = mensal * 12;

  return {
    total: anual,
    mensal,
    detalhes: [
      { nome: "INSS (5% do salário mínimo R$ 1.518)", valor: inss * 12, aliquota: 5 },
      ...(icms > 0 ? [{ nome: "ICMS (fixo R$ 1,00/mês)", valor: icms * 12, aliquota: 0 }] : []),
      ...(iss > 0 ? [{ nome: "ISS (fixo R$ 5,00/mês)", valor: iss * 12, aliquota: 0 }] : []),
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
    // Aceita formatos: "3000", "3.000", "3000,00", "3.000,00"
    const cleanValue = faturamento.replace(/\./g, "").replace(",", ".");
    const fat = parseFloat(cleanValue);
    if (!fat || fat <= 0) return;

    const faturamentoAnual = fat * 12;
    const nFunc = parseInt(numFuncionarios) || 0;
    const salMedio = parseFloat(mediaSalarial.replace(/\./g, "").replace(",", ".")) || 0;
    const folhaAnual = nFunc * salMedio * 12;

    // Determinar tipo de atividade para cálculos
    const tipoAtiv = atividadeSelecionada?.tipo === "industria" ? "comercio" : (atividadeSelecionada?.tipo ?? tipo);
    const tipoMEI = atividadeSelecionada?.tipo ?? (tipo as "comercio" | "servicos" | "industria" | "comercio_servicos");

    // Regras MEI 2025:
    // - Faturamento até R$ 81.000/ano (R$ 6.750/mês)
    // - Máximo 1 funcionário
    // - Atividade permitida na lista CNAE
    // - Não ser sócio/titular de outra empresa
    const simplesDisponivel = faturamentoAnual <= 4800000;
    const meiDisponivel = faturamentoAnual <= 81000 && nFunc <= 1 && (atividadeSelecionada?.mei ?? true);

    const simplesAliquota = simplesDisponivel ? calcularSimples(faturamentoAnual, tipoAtiv as "comercio" | "servicos") : 0;
    const simplesTotal = simplesDisponivel ? faturamentoAnual * simplesAliquota : 0;
    const { total: lpTotal, detalhes: lpDetalhes } = calcularLucroPresumido(faturamentoAnual, tipoAtiv as "comercio" | "servicos", folhaAnual);
    const { total: lrTotal, detalhes: lrDetalhes } = calcularLucroReal(faturamentoAnual, tipoAtiv as "comercio" | "servicos", 0.15, folhaAnual);
    const mei = calcularMEI(tipoMEI);

    // Custos operacionais reais por regime (estimativa anual)
    // MEI: sem contador obrigatório, sem obrigações acessórias complexas
    // Simples: precisa de contador (~R$ 200-400/mês), PGDAS mensal, DEFIS anual
    // Lucro Presumido: contador (~R$ 500-800/mês), DCTF, ECD, ECF
    // Lucro Real: contador (~R$ 800-1500/mês), escrituração completa
    const custoContadorSimples = 300 * 12; // R$ 300/mês média
    const custoContadorLP = 600 * 12; // R$ 600/mês média
    const custoContadorLR = 1000 * 12; // R$ 1.000/mês média

    const opcoes: { nome: "mei" | "simples" | "presumido" | "real"; valorTributos: number; custoTotal: number }[] = [
      { nome: "presumido", valorTributos: lpTotal, custoTotal: lpTotal + custoContadorLP },
      { nome: "real", valorTributos: lrTotal, custoTotal: lrTotal + custoContadorLR },
    ];
    if (simplesDisponivel) opcoes.push({ nome: "simples", valorTributos: simplesTotal, custoTotal: simplesTotal + custoContadorSimples });
    if (meiDisponivel) opcoes.push({ nome: "mei", valorTributos: mei.total, custoTotal: mei.total }); // MEI não precisa de contador
    const melhor = opcoes.reduce((a, b) => (a.custoTotal < b.custoTotal ? a : b));
    const economia = Math.abs(Math.max(...opcoes.map((o) => o.custoTotal)) - melhor.custoTotal);

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
              placeholder="Ex: 3000"
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
              placeholder="Ex: 1518"
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
            <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-6 border border-orange-200">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="text-orange-600" size={24} />
                <h3 className="text-xl font-bold text-orange-900">Melhor Opção (Custo Total Real)</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-orange-700 mb-1">Regime Recomendado</p>
                  <p className="text-2xl font-bold text-orange-900 capitalize">
                    {resultado.melhorOpcao === "mei" ? "MEI" : resultado.melhorOpcao === "simples" ? "Simples Nacional" : resultado.melhorOpcao === "presumido" ? "Lucro Presumido" : "Lucro Real"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-orange-700 mb-1">Economia Anual Total</p>
                  <p className="text-2xl font-bold text-orange-900">{formatCurrency(resultado.economia)}</p>
                </div>
                <div>
                  <p className="text-sm text-orange-700 mb-1">Faturamento Anual</p>
                  <p className="text-2xl font-bold text-orange-900">{formatCurrency(resultado.faturamentoAnual)}</p>
                </div>
              </div>
              {resultado.melhorOpcao === "mei" && (
                <div className="mt-4 bg-orange-100 rounded-lg p-3">
                  <p className="text-sm text-orange-800">
                    💡 O MEI é a melhor opção porque: sem custo de contador, tributo fixo de {formatCurrency(resultado.meiMensal)}/mês, e declaração anual simplificada (DASN-SIMEI) que você mesma faz online.
                  </p>
                </div>
              )}
            </div>

            {/* Comparativo de Regimes */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* MEI */}
              {resultado.meiDisponivel && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`bg-white rounded-xl p-6 shadow-lg border-2 ${resultado.melhorOpcao === "mei" ? "border-orange-400 ring-2 ring-orange-200" : "border-gray-200"}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-900">MEI</h4>
                    {resultado.melhorOpcao === "mei" && (
                      <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded-full">RECOMENDADO</span>
                    )}
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Custo Mensal Total</p>
                    <p className="text-2xl font-bold text-orange-600">{formatCurrency(resultado.meiMensal)}</p>
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
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-700">
                      <span>Contador</span>
                      <span className="font-semibold text-orange-600">Não precisa ✓</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Declaração anual</span>
                      <span className="font-semibold text-orange-600">Faz online grátis ✓</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Nota fiscal</span>
                      <span className="font-semibold text-orange-600">Emite pelo gov.br ✓</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Simples Nacional */}
              {resultado.simplesDisponivel && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`bg-white rounded-xl p-6 shadow-lg border-2 ${resultado.melhorOpcao === "simples" ? "border-orange-400 ring-2 ring-orange-200" : "border-gray-200"}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-900">Simples Nacional</h4>
                    {resultado.melhorOpcao === "simples" && (
                      <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded-full">RECOMENDADO</span>
                    )}
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Tributo (alíquota efetiva)</p>
                    <p className="text-2xl font-bold text-pink-600">{formatPercent(resultado.simplesAliquota)}</p>
                    <p className="text-xs text-gray-500 mt-1">Tributos/ano: {formatCurrency(resultado.simplesTotal)}</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-700">
                      <span>Contador (obrigatório)</span>
                      <span className="font-semibold text-red-500">~R$ 300/mês</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Custo total anual estimado</span>
                      <span className="font-semibold">{formatCurrency(resultado.simplesTotal + 3600)}</span>
                    </div>
                  </div>
                  <div className="mt-3 bg-pink-50 p-3 rounded text-xs text-pink-700">
                    Exige contador, PGDAS mensal, DEFIS anual e obrigações acessórias
                  </div>
                </motion.div>
              )}

              {/* Lucro Presumido */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className={`bg-white rounded-xl p-6 shadow-lg border-2 ${resultado.melhorOpcao === "presumido" ? "border-orange-400 ring-2 ring-orange-200" : "border-gray-200"}`}
              >
                <h4 className="text-lg font-bold text-gray-900 mb-4">Lucro Presumido</h4>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Tributo Anual</p>
                  <p className="text-2xl font-bold text-orange-600">{formatCurrency(resultado.lpTotal)}</p>
                  <p className="text-xs text-gray-500 mt-1">+ Contador ~R$ 600/mês = {formatCurrency(resultado.lpTotal + 7200)}/ano total</p>
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

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className={`bg-white rounded-xl p-6 shadow-lg border-2 ${resultado.melhorOpcao === "real" ? "border-orange-400 ring-2 ring-orange-200" : "border-gray-200"}`}
              >
                <h4 className="text-lg font-bold text-gray-900 mb-4">Lucro Real</h4>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Tributo Anual</p>
                  <p className="text-2xl font-bold text-pink-600">{formatCurrency(resultado.lrTotal)}</p>
                  <p className="text-xs text-gray-500 mt-1">+ Contador ~R$ 1.000/mês = {formatCurrency(resultado.lrTotal + 12000)}/ano total</p>
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

            {/* Alertas sobre Alvará e Requisitos */}
            {atividadeSelecionada && (
              <div className="space-y-4">
                {/* Alvará Sanitário */}
                {atividadeSelecionada.alvaraSanitario && (
                  <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 flex gap-4">
                    <AlertCircle className="text-amber-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <h4 className="font-bold text-amber-900 mb-2">⚠️ Alvará Sanitário Necessário</h4>
                      <p className="text-sm text-amber-800">
                        A atividade <span className="font-semibold">{atividadeSelecionada.nome}</span> envolve manipulação de alimentos e exige Alvará Sanitário da Vigilância Sanitária municipal. Procure a Vigilância Sanitária de Goiânia ou a Sala do Empreendedor para orientação.
                      </p>
                    </div>
                  </div>
                )}

                {/* Alvará de Funcionamento */}
                {atividadeSelecionada.alvaraFuncionamento && (
                  <div className="bg-orange-50 rounded-xl p-6 border border-orange-200 flex gap-4">
                    <AlertCircle className="text-orange-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <h4 className="font-bold text-orange-900 mb-2">📋 Alvará de Funcionamento</h4>
                      <p className="text-sm text-orange-800">
                        Se você tem ponto fixo (loja, quiosque, espaço), precisa de Alvará de Funcionamento da prefeitura. MEI que trabalha em casa ou como ambulante pode ser dispensado — consulte a Sala do Empreendedor.
                      </p>
                    </div>
                  </div>
                )}

                {/* Atividade não permite MEI */}
                {!atividadeSelecionada.mei && (
                  <div className="bg-red-50 rounded-xl p-6 border border-red-200 flex gap-4">
                    <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <h4 className="font-bold text-red-900 mb-2">🚫 Atividade Não Permitida como MEI</h4>
                      <p className="text-sm text-red-800">
                        A atividade <span className="font-semibold">{atividadeSelecionada.nome}</span> é regulamentada por conselho de classe e não pode ser MEI. Considere abrir como Simples Nacional (ME) ou Lucro Presumido.
                      </p>
                    </div>
                  </div>
                )}

                {/* ISS explicação */}
                {(atividadeSelecionada.tipo === "servicos" || atividadeSelecionada.tipo === "comercio_servicos") && resultado?.meiDisponivel && (
                  <div className="bg-pink-50 rounded-xl p-6 border border-pink-200 flex gap-4">
                    <Info className="text-pink-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <h4 className="font-bold text-pink-900 mb-2">💡 Sobre o ISS no MEI</h4>
                      <p className="text-sm text-pink-800">
                        Como prestador de serviços MEI, você paga R$ 5,00/mês de ISS fixo no DAS. Esse valor já está incluído na guia mensal. Não precisa pagar ISS separado à prefeitura.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Requisitos MEI */}
            {resultado?.meiDisponivel && (
              <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                <h4 className="font-bold text-orange-900 mb-3">✅ Requisitos para ser MEI (2025)</h4>
                <div className="grid md:grid-cols-2 gap-3 text-sm text-orange-800">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>Faturamento até R$ 81.000/ano (R$ 6.750/mês)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>Máximo 1 funcionário (salário mínimo ou piso da categoria)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>Atividade permitida na lista de CNAEs do MEI</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>Não ser sócio ou titular de outra empresa</span>
                  </div>
                </div>
              </div>
            )}

            {/* Dica */}
            <div className="bg-pink-50 rounded-xl p-6 border border-pink-200 flex gap-4">
              <Info className="text-pink-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <h4 className="font-bold text-pink-900 mb-2">Dica Importante</h4>
                <p className="text-sm text-pink-800">
                  Esta simulação é educativa e baseada nas tabelas vigentes em 2025. Consulte um contador ou a Sala do Empreendedor para orientação profissional específica para seu negócio.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
