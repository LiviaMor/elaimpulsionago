import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Calculator, Users, BookOpen, Zap, ArrowRight, Menu, X,
  TrendingUp, Heart, MapPin, BarChart3, Target, Sparkles,
  ChevronRight, Star, Award, Shield, Lightbulb, Rocket,
  GraduationCap, Handshake, LineChart, CheckCircle2, Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TaxCalculator from "@/components/TaxCalculator";
import TypebotWidget from "@/components/TypebotWidget";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart as RechartsLineChart, Line, Legend, Cell
} from "recharts";

// IBGE PNADc 3º Trim. 2025 - Dados reais
const dadosFaixaEtaria = [
  { faixa: "14-17", valor: 0.4 },
  { faixa: "18-24", valor: 5.9 },
  { faixa: "25-39", valor: 36.8 },
  { faixa: "40-59", valor: 44.8 },
  { faixa: "60+", valor: 12.2 },
];

const dadosEscolaridade = [
  { nivel: "Sem instrução", valor: 1 },
  { nivel: "Fundamental", valor: 17 },
  { nivel: "Médio", valor: 45 },
  { nivel: "Superior+", valor: 38 },
];

const dadosFormalizacao = [
  { ano: "2016", semCNPJ: 70, comCNPJ: 30 },
  { ano: "2017", semCNPJ: 70, comCNPJ: 30 },
  { ano: "2018", semCNPJ: 72, comCNPJ: 28 },
  { ano: "2019", semCNPJ: 68, comCNPJ: 32 },
  { ano: "2020", semCNPJ: 69, comCNPJ: 31 },
  { ano: "2021", semCNPJ: 65, comCNPJ: 35 },
  { ano: "2022", semCNPJ: 58, comCNPJ: 42 },
  { ano: "2023", semCNPJ: 58, comCNPJ: 42 },
  { ano: "2024", semCNPJ: 60, comCNPJ: 40 },
  { ano: "2025", semCNPJ: 55, comCNPJ: 45 },
];

const coresFaixaEtaria = ["#fdba74", "#fb923c", "#f97316", "#ea580c", "#c2410c"];
const coresEscolaridade = ["#fda4af", "#fb7185", "#f43f5e", "#e11d48"];

// Sebrae Goiás - Pesquisa Perfil do MEI, 2025
const dadosDificuldades = [
  { nome: "Obter crédito/recursos", valor: 39 },
  { nome: "Expandir o negócio", valor: 29 },
  { nome: "Conhecimento administrativo", valor: 27 },
  { nome: "Redes sociais", valor: 22 },
  { nome: "Pagamento do DAS", valor: 21 },
  { nome: "Captar clientes", valor: 19 },
  { nome: "Infraestrutura", valor: 17 },
  { nome: "Conhecimento do mercado", valor: 11 },
  { nome: "Acesso a tecnologias", valor: 11 },
  { nome: "Gerir contas", valor: 10 },
];

const dadosFerramentas = [
  { nome: "WhatsApp Business", valor: 57 },
  { nome: "Instagram Business", valor: 27 },
  { nome: "Google Meu Negócio", valor: 14 },
  { nome: "Outros", valor: 10 },
  { nome: "Meta Ads", valor: 10 },
  { nome: "Apps de gestão", valor: 5 },
  { nome: "Google Ads", valor: 4 },
  { nome: "Não utilizo nenhuma", valor: 25 },
];

// Animated counter hook
function useCounter(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(!startOnView);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref as any, { once: true });

  useEffect(() => {
    if (startOnView && isInView) setStarted(true);
  }, [isInView, startOnView]);

  useEffect(() => {
    if (!started) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end, duration]);

  return { count, ref };
}

// Floating particles component
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: i % 3 === 0 ? "#f97316" : i % 3 === 1 ? "#ec4899" : "#fb923c",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.3,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

const trilhas = [
  {
    icon: <Heart className="w-7 h-7" />,
    title: "Comunidade",
    subtitle: "Você não está sozinha",
    desc: "Conecte-se com mulheres que vivem o mesmo momento. Troque experiências, encontre apoio e veja que outras mulheres conseguiram — porque quem tem rede, tem coragem.",
    color: "from-pink-400 to-rose-500",
    bg: "bg-pink-50",
    border: "border-pink-200",
  },
  {
    icon: <GraduationCap className="w-7 h-7" />,
    title: "Formação",
    subtitle: "Orientação prática",
    desc: "Cursos presenciais, palestras sobre empreendedorismo, encontros com temas jurídicos, contábeis e de gestão. Conhecimento acessível com quem pode te guiar.",
    color: "from-orange-400 to-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  {
    icon: <Rocket className="w-7 h-7" />,
    title: "Apoio Digital",
    subtitle: "Ferramentas simplificadas",
    desc: "Chatbot para dúvidas sobre formalização, calculadora tributária para entender MEI vs Simples Nacional, e orientações práticas para fomentar seu negócio.",
    color: "from-rose-400 to-pink-500",
    bg: "bg-rose-50",
    border: "border-rose-200",
  },
  {
    icon: <LineChart className="w-7 h-7" />,
    title: "Crescimento",
    subtitle: "Escale com segurança",
    desc: "Acesso a microcrédito, networking estratégico e ferramentas de gestão para quem já deu os primeiros passos e quer fazer o negócio crescer de verdade.",
    color: "from-amber-400 to-orange-500",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
];

const depoimentos = [
  {
    nome: "Maria Silva",
    negocio: "Confeitaria Doce Maria",
    foto: "👩🏽‍🍳",
    texto: "Estava desempregada e não sabia por onde começar. Na comunidade encontrei mulheres que viviam o mesmo momento e me deram coragem. Hoje faturo R$ 5 mil por mês com minha confeitaria formalizada.",
    resultado: "De desempregada a MEI",
  },
  {
    nome: "Ana Santos",
    negocio: "Tech Ana — Desenvolvimento Web",
    foto: "👩🏿‍💻",
    texto: "Trabalhava CLT insatisfeita, mas tinha medo de largar tudo. A orientação prática sobre formalização e a calculadora tributária me deram segurança para fazer a transição.",
    resultado: "Transição CLT → empreendedora",
  },
  {
    nome: "Juliana Costa",
    negocio: "Ateliê Juliana",
    foto: "👩🏻‍🎨",
    texto: "Eu já vendia, mas na informalidade. Não entendia nada de tributos. O chatbot me ajudou a abrir meu MEI e a calculadora mostrou que eu pagaria só R$ 75,90 por mês. Mudou tudo.",
    resultado: "Formalizada em 1 semana",
  },
];

export default function Home() {
  const [showCalculator, setShowCalculator] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTrilha, setActiveTrilha] = useState(0);
  const [activeDepoimento, setActiveDepoimento] = useState(0);

  const logoUrl = "/logo-nova.png";

  const scrollToChatbot = () => {
    document.getElementById("chatbot")?.scrollIntoView({ behavior: "smooth" });
  };
  const heroImage = "https://d2xsxph8kpxj0f.cloudfront.net/310519663230880244/ZiFCrviuw9tzbL8mdF3mvw/hero-women-empowerment-VzR3C7axtT7tzR6A8TCjDz.webp";

  const counter1 = useCounter(54, 2500);
  const counter2 = useCounter(45, 2000);
  const counter3 = useCounter(45, 2200);
  const counter4 = useCounter(82, 1800);

  // Auto-rotate depoimentos
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDepoimento((prev) => (prev + 1) % depoimentos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="ELA Impulsiona GO" className="h-12 w-auto" />
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            {[
              { href: "#problema", label: "O Problema" },
              { href: "#trilhas", label: "Trilhas" },
              { href: "#calculadora", label: "Calculadora" },
              { href: "#impacto", label: "Impacto" },
              { href: "#dados", label: "Dados" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-gray-600 font-medium hover:text-orange-600 transition text-sm"
              >
                {item.label}
              </a>
            ))}
            <Button
              onClick={scrollToChatbot}
              size="sm"
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-full px-6"
            >
              Começar Agora
            </Button>
          </nav>
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 p-4 space-y-3"
          >
            {["O Problema", "Trilhas", "Calculadora", "Impacto", "Dados"].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase().replace(" ", "")}`}
                className="block text-gray-700 font-medium hover:text-orange-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </a>
            ))}
            <Button
              onClick={() => { scrollToChatbot(); setMobileMenuOpen(false); }}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full"
            >
              Começar Agora
            </Button>
          </motion.div>
        )}
      </header>

      {/* HERO - Impactante */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-pink-50 min-h-[90vh] flex items-center">
        <FloatingParticles />
        <div className="container grid md:grid-cols-2 gap-12 items-center py-16 md:py-0 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-6"
            >
              <Sparkles size={16} />
              Hackathon Go UAI Tech 2026
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Quando uma mulher encontra apoio para{" "}
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500">
                  empreender
                </span>
                <motion.span
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                />
              </span>
              , ela começa a construir sua independência.
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Comunidade de direcionamento e conexão para mulheres a partir dos 25 anos que querem dar os primeiros passos no empreendedorismo — ou fazer a transição do emprego com mais segurança. Porque nenhuma mulher precisa começar sozinha.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button
                onClick={scrollToChatbot}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-full px-8 py-6 text-lg shadow-lg shadow-orange-500/25"
              >
                <Play className="mr-2" size={20} />
                Iniciar Minha Trilha
              </Button>
              <Button
                variant="outline"
                onClick={() => document.getElementById("problema")?.scrollIntoView({ behavior: "smooth" })}
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full px-8 py-6 text-lg"
              >
                Entenda o Problema
              </Button>
            </div>

            {/* Mini stats */}
            <div className="flex gap-8">
              {[
                { value: "54,6%", label: "dos brasileiros que querem empreender são mulheres (Sebrae)" },
                { value: "82%", label: "começaram a empreender para escapar do desemprego" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.2 }}
                >
                  <p className="text-2xl font-bold text-orange-600">{stat.value}</p>
                  <p className="text-xs text-gray-500 max-w-[140px]">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative">
              <img
                src={heroImage}
                alt="Mulheres empreendedoras unidas"
                className="rounded-3xl shadow-2xl w-full h-auto object-cover"
              />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-orange-500/20 to-pink-500/20 pointer-events-none" />

              {/* Floating card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <TrendingUp className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">10M+</p>
                    <p className="text-xs text-gray-500">mulheres empreendedoras no Brasil</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                    <Users className="text-pink-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">44,4%</p>
                    <p className="text-xs text-gray-500">empregadas buscando mudança</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SEÇÃO: O PROBLEMA É REAL */}
      <section id="problema" className="py-20 md:py-28 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <AlertTriangleIcon />
              O Problema é Real
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Mulheres empreendedoras em Goiás{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">
                enfrentam barreiras invisíveis
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              São mais de 10 milhões de mulheres empreendedoras no Brasil (Sebrae), mas 82% começaram por necessidade. Em Goiás, 55% ainda são informais (IBGE 2025). Nossa pesquisa de validação revelou: 44,4% das mulheres estão empregadas, mas insatisfeitas e buscando mudança. Elas querem empreender, mas não sabem por onde começar.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: <Users size={28} />, value: counter1, suffix: "%", label: "Das mulheres brasileiras querem empreender até 2026 (Sebrae)", color: "from-orange-500 to-amber-500" },
              { icon: <TrendingUp size={28} />, value: counter2, suffix: "%", label: "Das empreendedoras em GO possuem CNPJ — 55% ainda informais (IBGE 2025)", color: "from-pink-500 to-rose-500" },
              { icon: <GraduationCap size={28} />, value: counter3, suffix: "%", label: "Têm ensino médio — precisam de capacitação acessível (IBGE 2025)", color: "from-rose-400 to-pink-500" },
              { icon: <BarChart3 size={28} />, value: counter4, suffix: "%", label: "Começaram a empreender para escapar do desemprego (Sebrae)", color: "from-amber-500 to-orange-500" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition group"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                  {stat.icon}
                </div>
                <p className="text-4xl font-bold mb-2">
                  <span ref={stat.value.ref}>{stat.value.count.toLocaleString("pt-BR")}</span>
                  {stat.suffix}
                </p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO: DADOS IBGE - GRÁFICOS INTERATIVOS */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-gray-900 to-gray-950 text-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 bg-pink-500/20 text-pink-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <BarChart3 size={16} />
              Dados Oficiais IBGE — PNADc 3º Trim. 2025
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Radiografia da{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">
                empreendedora goiana
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Dados reais que fundamentam nossa solução. Cada gráfico revela uma oportunidade de impacto para políticas públicas municipais.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Gráfico 1: Faixa Etária */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-lg font-bold mb-1">Empreendedoras por Faixa Etária</h3>
              <p className="text-sm text-gray-400 mb-6">81,6% estão entre 25 e 59 anos — nosso público-alvo</p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={dadosFaixaEtaria} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="faixa" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
                  <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1f2937", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }}
                    formatter={(value: number) => [`${value}%`, "Participação"]}
                  />
                  <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
                    {dadosFaixaEtaria.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={coresFaixaEtaria[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Gráfico 2: Escolaridade */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-lg font-bold mb-1">Empreendedoras por Escolaridade</h3>
              <p className="text-sm text-gray-400 mb-6">45% têm ensino médio — capacitação acessível é essencial</p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={dadosEscolaridade} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="nivel" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
                  <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1f2937", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }}
                    formatter={(value: number) => [`${value}%`, "Participação"]}
                  />
                  <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
                    {dadosEscolaridade.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={coresEscolaridade[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Gráfico 3: Evolução da Formalização - Full width */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold mb-1">Evolução da Formalização (2016–2025)</h3>
                <p className="text-sm text-gray-400">De 30% para 45% com CNPJ — mas 55% ainda são informais</p>
              </div>
              <div className="flex gap-4 mt-3 md:mt-0">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-pink-500" />
                  <span className="text-xs text-gray-400">Sem CNPJ</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-xs text-gray-400">Com CNPJ</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <RechartsLineChart data={dadosFormalizacao} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="ano" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }}
                  formatter={(value: number, name: string) => [`${value}%`, name === "semCNPJ" ? "Sem CNPJ" : "Com CNPJ"]}
                />
                <Line type="monotone" dataKey="semCNPJ" stroke="#ec4899" strokeWidth={3} dot={{ fill: "#ec4899", r: 5 }} activeDot={{ r: 7 }} />
                <Line type="monotone" dataKey="comCNPJ" stroke="#f97316" strokeWidth={3} dot={{ fill: "#f97316", r: 5 }} activeDot={{ r: 7 }} />
              </RechartsLineChart>
            </ResponsiveContainer>

            {/* Insight box */}
            <div className="mt-6 bg-orange-500/10 rounded-xl p-4 border border-orange-500/20">
              <div className="flex items-start gap-3">
                <Lightbulb className="text-orange-400 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-semibold text-orange-300 mb-1">Insight para Políticas Públicas</p>
                  <p className="text-sm text-gray-400">
                    A formalização avançou 15 pontos percentuais em 9 anos, mas ainda há 55% de empreendedoras informais. 
                    Com trilhas personalizadas e integração com a Sala do Empreendedor, projetamos acelerar essa curva em até 3x.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Gráficos Sebrae - Dificuldades e Ferramentas */}
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {/* Gráfico 4: Principais Dificuldades */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-lg font-bold mb-1">Principais Dificuldades das MEIs</h3>
              <p className="text-sm text-gray-400 mb-4">39% têm dificuldade em obter crédito — Sebrae GO, 2025</p>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={dadosDificuldades} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="nome" tick={{ fill: "#d1d5db", fontSize: 11 }} axisLine={false} tickLine={false} width={150} />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }} formatter={(value: number) => [`${value}%`, "Responderam"]} />
                  <Bar dataKey="valor" fill="#f472b6" radius={[0, 6, 6, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-[10px] text-gray-600 mt-2">Base: 329 · Múltipla escolha · Fonte: Pesquisa Perfil do MEI, Sebrae Goiás, 2025</p>
            </motion.div>

            {/* Gráfico 5: Ferramentas Digitais */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-lg font-bold mb-1">Ferramentas Digitais das MEIs</h3>
              <p className="text-sm text-gray-400 mb-4">57% usam WhatsApp Business · 25% não usam nenhuma</p>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={dadosFerramentas} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="nome" tick={{ fill: "#d1d5db", fontSize: 11 }} axisLine={false} tickLine={false} width={150} />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }} formatter={(value: number) => [`${value}%`, "Responderam"]} />
                  <Bar dataKey="valor" fill="#fb923c" radius={[0, 6, 6, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-[10px] text-gray-600 mt-2">Base: 329 · Múltipla escolha · Fonte: Pesquisa Perfil do MEI, Sebrae Goiás, 2025</p>
            </motion.div>
          </div>

          {/* Cards de Destaque - Dados do Infográfico */}
          <div className="grid md:grid-cols-4 gap-4 mt-12">
            {[
              {
                emoji: "💰",
                titulo: "RENDIMENTO",
                valor: "R$ 3.723",
                desc: "Rendimento médio mensal. Remuneração aumentou 44% em 10 anos.",
                cor: "from-orange-500 to-amber-500",
                bordaCor: "border-orange-500/30",
              },
              {
                emoji: "📍",
                titulo: "LOCAL DE TRABALHO",
                valor: "46% + 38%",
                desc: "46% em pontos fixos e 38% no próprio domicílio — sobreposição de tarefas.",
                cor: "from-pink-500 to-rose-500",
                bordaCor: "border-pink-500/30",
              },
              {
                emoji: "⏰",
                titulo: "JORNADA",
                valor: "36h",
                desc: "Jornada média semanal — muitas conciliam trabalho com tarefas domésticas.",
                cor: "from-rose-400 to-pink-500",
                bordaCor: "border-rose-500/30",
              },
              {
                emoji: "📋",
                titulo: "FORMALIZAÇÃO",
                valor: "70% → 55%",
                desc: "Informalidade caiu de 70% (2016) para 55% (2025), mas ainda é maioria.",
                cor: "from-pink-500 to-rose-500",
                bordaCor: "border-pink-500/30",
              },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-white/5 backdrop-blur-sm rounded-2xl p-5 border ${card.bordaCor} hover:bg-white/10 transition group`}
              >
                <span className="text-2xl">{card.emoji}</span>
                <p className={`text-xs font-bold uppercase tracking-wider mt-3 mb-1 text-transparent bg-clip-text bg-gradient-to-r ${card.cor}`}>
                  {card.titulo}
                </p>
                <p className="text-2xl font-bold text-white mb-2">{card.valor}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Fonte */}
          <p className="text-center text-xs text-gray-600 mt-8">
            Fonte: IBGE, Pesquisa Nacional por Amostra de Domicílios Contínua (PNADc), 3º Trimestre 2025 — Goiás
          </p>
        </div>
      </section>

      {/* SEÇÃO: TRILHAS PERSONALIZADAS */}
      <section id="trilhas" className="py-20 md:py-28 bg-gradient-to-b from-white to-orange-50/50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Target size={16} />
              Solução Personalizada
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Três frentes que se adaptam a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
                cada mulher
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Mais do que uma plataforma de conteúdo: um ambiente onde mulheres se conectam, trocam experiências e acessam orientações práticas para começar ou crescer.
            </p>
          </motion.div>

          {/* Trilha visual interativa */}
          <div className="grid md:grid-cols-12 gap-8 items-start">
            {/* Steps sidebar */}
            <div className="md:col-span-5 space-y-4">
              {trilhas.map((trilha, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setActiveTrilha(idx)}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 ${
                    activeTrilha === idx
                      ? `${trilha.bg} ${trilha.border} shadow-lg scale-[1.02]`
                      : "bg-white border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${trilha.color} text-white flex items-center justify-center flex-shrink-0`}>
                      {trilha.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 uppercase">Etapa {idx + 1}</span>
                        {activeTrilha === idx && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 rounded-full bg-orange-500"
                          />
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{trilha.title}</h3>
                      <p className="text-sm text-gray-500">{trilha.subtitle}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Detail panel */}
            <div className="md:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTrilha}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`${trilhas[activeTrilha].bg} rounded-3xl p-8 md:p-10 border-2 ${trilhas[activeTrilha].border} min-h-[360px] flex flex-col justify-between`}
                >
                  <div>
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${trilhas[activeTrilha].color} text-white mb-6`}>
                      {trilhas[activeTrilha].icon}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      {trilhas[activeTrilha].title}: {trilhas[activeTrilha].subtitle}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                      {trilhas[activeTrilha].desc}
                    </p>

                    {/* Features list */}
                    <div className="space-y-3">
                      {[
                        ["Grupos de mulheres no mesmo momento", "Rede de apoio e pertencimento", "Histórias de quem já conseguiu"],
                        ["Cursos presenciais gratuitos", "Palestras sobre empreendedorismo", "Encontros jurídicos e contábeis"],
                        ["Chatbot de formalização", "Calculadora tributária MEI/Simples", "Orientações para fomentar o negócio"],
                        ["Acesso a microcrédito", "Networking estratégico", "Dashboard de gestão"],
                      ][activeTrilha].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle2 className="text-orange-500 flex-shrink-0" size={18} />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={scrollToChatbot}
                    className={`mt-8 bg-gradient-to-r ${trilhas[activeTrilha].color} text-white rounded-full px-8 self-start`}
                  >
                    Começar esta trilha <ArrowRight className="ml-2" size={18} />
                  </Button>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Chatbot embutido na seção de trilhas */}
          <div id="chatbot" className="mt-16 scroll-mt-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-8">
                <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <Zap size={16} />
                  Assistente Virtual
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  Converse com a{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
                    ELA
                  </span>
                  , sua assistente
                </h3>
                <p className="text-gray-600 max-w-xl mx-auto">
                  Tire dúvidas sobre formalização, MEI, tributos e dê os primeiros passos na sua jornada empreendedora.
                </p>
              </div>
            </motion.div>
            <div className="max-w-3xl mx-auto">
              <TypebotWidget
                typebotId="ela-impulsiona-go"
                height="600px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO: CALCULADORA */}
      <section id="calculadora" className="py-20 md:py-28 bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Calculator size={16} />
              Ferramenta Gratuita
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Descubra o melhor regime tributário{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                para seu negócio
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simule MEI, Simples Nacional, Lucro Presumido e Lucro Real. Economize até 40% em tributos escolhendo o regime certo.
            </p>
          </motion.div>

          {!showCalculator ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-10 text-center text-white shadow-xl shadow-orange-500/20 cursor-pointer hover:shadow-2xl hover:shadow-orange-500/30 transition-all"
                onClick={() => setShowCalculator(true)}
              >
                <Calculator className="mx-auto mb-4" size={48} />
                <h3 className="text-2xl font-bold mb-3">Calculadora Tributária Inteligente</h3>
                <p className="text-orange-100 mb-6">Compare todos os regimes tributários e descubra qual é o ideal para o seu negócio</p>
                <Button className="bg-white text-orange-600 hover:bg-orange-50 rounded-full px-8 py-6 text-lg font-bold">
                  Abrir Calculadora <ArrowRight className="ml-2" size={20} />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-end mb-4">
                <button onClick={() => setShowCalculator(false)} className="text-gray-400 hover:text-gray-600 transition">
                  <X size={24} />
                </button>
              </div>
              <TaxCalculator />
            </motion.div>
          )}
        </div>
      </section>

      {/* SEÇÃO: DEPOIMENTOS / IMPACTO */}
      <section id="impacto" className="py-20 md:py-28 bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Heart size={16} />
              Histórias Reais
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Vidas transformadas pelo{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
                empreendedorismo
              </span>
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDepoimento}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100"
              >
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="text-7xl">{depoimentos[activeDepoimento].foto}</div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex gap-1 justify-center md:justify-start mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} className="text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-lg text-gray-700 italic mb-6 leading-relaxed">
                      "{depoimentos[activeDepoimento].texto}"
                    </p>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div>
                        <p className="font-bold text-gray-900">{depoimentos[activeDepoimento].nome}</p>
                        <p className="text-sm text-gray-500">{depoimentos[activeDepoimento].negocio}</p>
                      </div>
                      <div className="md:ml-auto">
                        <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-bold">
                          <TrendingUp size={16} />
                          {depoimentos[activeDepoimento].resultado}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="flex justify-center gap-3 mt-8">
              {depoimentos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveDepoimento(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    activeDepoimento === idx
                      ? "bg-orange-500 w-8"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Ver depoimento ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO: MAPEAMENTO DE DADOS - POLÍTICAS PÚBLICAS */}
      <section id="dados" className="py-20 md:py-28 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-orange-500 to-pink-500 rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <BarChart3 size={16} />
              Valor para Políticas Públicas
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Dados reais para{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">
                decisões inteligentes
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Fortalecer o empreendedorismo feminino é fortalecer autonomia econômica, inclusão produtiva e desenvolvimento local. Quando uma mulher empreende com apoio, ela aumenta sua renda, amplia sua independência e movimenta a economia da sua comunidade.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <MapPin size={28} />,
                title: "Mapeamento Geográfico",
                desc: "Identificação de bairros com maior concentração de empreendedoras informais, permitindo ações direcionadas da prefeitura.",
                color: "from-orange-500 to-amber-500",
              },
              {
                icon: <BarChart3 size={28} />,
                title: "Dashboard Municipal",
                desc: "Painel em tempo real com dados sobre setores, faturamento, necessidades de capacitação e taxa de formalização por região.",
                color: "from-pink-500 to-rose-500",
              },
              {
                icon: <Shield size={28} />,
                title: "Integração com Políticas Públicas",
                desc: "Conexão direta com programas do SEBRAE, Sala do Empreendedor e políticas municipais de incentivo ao empreendedorismo feminino.",
                color: "from-rose-400 to-orange-500",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition group"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Modelo de Negócio */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-orange-500/10 to-pink-500/10 rounded-3xl p-8 md:p-12 border border-white/10"
          >
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">Como a Comunidade se Sustenta</h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Modelo de receita validado: conteúdo gratuito para as mulheres, monetização via empresas parceiras que querem alcançar esse público.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              {/* Lado gratuito */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                    <Heart size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Gratuito para a Mulher</h4>
                    <p className="text-xs text-gray-400">Acesso livre, sem custo</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    "Oficinas e workshops gratuitos",
                    "Divulgação de palestras abertas",
                    "Comunidade e rede de apoio",
                    "Chatbot de formalização",
                    "Calculadora tributária",
                    "Orientação sobre MEI e Simples",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-orange-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
                  <p className="text-xs text-orange-300 font-semibold">💡 Valor para a prefeitura: mapeamento de dados reais sobre o que as mulheres da cidade precisam</p>
                </div>
              </div>

              {/* Lado monetizado */}
              <div className="bg-white/5 rounded-2xl p-6 border border-pink-500/20">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                    <TrendingUp size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Fontes de Receita</h4>
                    <p className="text-xs text-gray-400">Monetização sustentável</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { titulo: "Espaço para Empresas", desc: "Empresas pagam para divulgar eventos, cursos e serviços para a comunidade de empreendedoras", icone: "🏢" },
                    { titulo: "Venda de Ingressos", desc: "Eventos pagos de parceiros com comissão por ingresso vendido pela plataforma", icone: "🎟️" },
                    { titulo: "Parcerias Institucionais", desc: "Convênios com SEBRAE, prefeituras e instituições que financiam capacitação", icone: "🤝" },
                    { titulo: "Dados para Políticas Públicas", desc: "Mapeamento de necessidades reais das empreendedoras — valiosíssimo para o governo municipal", icone: "📊" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-lg flex-shrink-0">{item.icone}</span>
                      <div>
                        <p className="text-sm font-semibold text-white">{item.titulo}</p>
                        <p className="text-xs text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Fluxo visual */}
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { valor: "R$ 0", label: "Custo para a empreendedora", cor: "text-orange-400" },
                { valor: "Empresas", label: "Pagam para divulgar eventos e serviços", cor: "text-pink-400" },
                { valor: "Dados", label: "Mapeamento real para políticas públicas", cor: "text-rose-400" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 rounded-xl p-4"
                >
                  <p className={`text-xl font-bold ${item.cor}`}>{item.valor}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* SEÇÃO: COMO FUNCIONA */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Zap size={16} />
              Simples e Rápido
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Comece em{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
                3 passos
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Entre na comunidade",
                desc: "Conecte-se com mulheres que vivem o mesmo momento. Troque experiências, encontre apoio e veja que é possível.",
                icon: <Heart size={24} />,
                color: "from-orange-500 to-amber-500",
              },
              {
                step: "02",
                title: "Aprenda com orientação",
                desc: "Acesse cursos presenciais, palestras e encontros com temas jurídicos, contábeis e de gestão — tudo gratuito.",
                icon: <BookOpen size={24} />,
                color: "from-pink-500 to-rose-500",
              },
              {
                step: "03",
                title: "Formalize e cresça",
                desc: "Use o chatbot e a calculadora tributária para formalizar seu negócio e entender o melhor enquadramento para você.",
                icon: <Rocket size={24} />,
                color: "from-rose-400 to-orange-500",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="relative text-center group"
              >
                {idx < 2 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-gray-200 to-transparent" />
                )}
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition shadow-lg`}>
                  {item.icon}
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Passo {item.step}</span>
                <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500" />
        <FloatingParticles />
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Empreender muda a renda de uma mulher.<br />
              <span className="text-orange-200">Ser apoiada muda a trajetória dela.</span>
            </h2>
            <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
              Nosso projeto nasce para garantir que nenhuma mulher precise começar sozinha. Junte-se a milhares de mulheres goianas que estão construindo sua independência com comunidade, orientação e ferramentas práticas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={scrollToChatbot}
                className="bg-white text-orange-600 hover:bg-orange-50 rounded-full px-10 py-6 text-lg font-bold shadow-xl"
              >
                <Rocket className="mr-2" size={20} />
                Começar Minha Trilha Grátis
              </Button>
              <Button
                onClick={() => setShowCalculator(true)}
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 rounded-full px-10 py-6 text-lg"
              >
                <Calculator className="mr-2" size={20} />
                Usar Calculadora
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-12">
              {[
                { icon: <Shield size={16} />, text: "100% Gratuito" },
                { icon: <Award size={16} />, text: "Dados Sebrae + IBGE" },
                { icon: <Users size={16} />, text: "10M+ empreendedoras no Brasil" },
                { icon: <MapPin size={16} />, text: "Goiás" },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 text-white/70 text-sm">
                  {badge.icon}
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-gray-500 py-16 border-t border-gray-100">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <img src={logoUrl} alt="ELA Impulsiona GO" className="h-12 w-auto mb-4" />
              <p className="text-sm leading-relaxed">
                Plataforma de empoderamento econômico feminino integrada a políticas públicas municipais de Goiás.
              </p>
            </div>
            <div>
              <h4 className="text-gray-900 font-bold mb-4 text-sm uppercase tracking-wider">Plataforma</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#trilhas" className="hover:text-orange-600 transition">Trilhas</a></li>
                <li><a href="#calculadora" className="hover:text-orange-600 transition">Calculadora</a></li>
                <li><a href="#impacto" className="hover:text-orange-600 transition">Impacto</a></li>
                <li><a href="#dados" className="hover:text-orange-600 transition">Dados</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-bold mb-4 text-sm uppercase tracking-wider">Parceiros</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-orange-600 transition">SEBRAE Goiás</a></li>
                <li><a href="#" className="hover:text-orange-600 transition">Hub Goiás</a></li>
                <li><a href="#" className="hover:text-orange-600 transition">Prefeitura de Goiânia</a></li>
                <li><a href="#" className="hover:text-orange-600 transition">Sala do Empreendedor</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-bold mb-4 text-sm uppercase tracking-wider">Contato</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-orange-600 transition">Instagram</a></li>
                <li><a href="#" className="hover:text-orange-600 transition">WhatsApp</a></li>
                <li><a href="#" className="hover:text-orange-600 transition">LinkedIn</a></li>
                <li><a href="mailto:contato@elaimpulsionago.com.br" className="hover:text-orange-600 transition">E-mail</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">&copy; 2026 ELA Impulsiona GO. Todos os direitos reservados.</p>
            <p className="text-xs text-gray-400">Hackathon Go UAI Tech 2026 — Empreendedorismo Feminino & Políticas Públicas</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Simple alert triangle icon component
function AlertTriangleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
