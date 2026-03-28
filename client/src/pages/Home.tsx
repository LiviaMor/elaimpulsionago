import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Users, BookOpen, Zap, ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import TaxCalculator from "@/components/TaxCalculator";
import TypebotWidget from "@/components/TypebotWidget";

export default function Home() {
  const [showCalculator, setShowCalculator] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTypebot, setShowTypebot] = useState(false);

  const logoUrl = "https://d2xsxph8kpxj0f.cloudfront.net/310519663230880244/ZiFCrviuw9tzbL8mdF3mvw/ela_impulsiona_go_logo_dark_50a9a1a0.png";
  const heroImage = "https://d2xsxph8kpxj0f.cloudfront.net/310519663230880244/ZiFCrviuw9tzbL8mdF3mvw/hero-women-empowerment-VzR3C7axtT7tzR6A8TCjDz.webp";
  const mentorshipImage = "https://d2xsxph8kpxj0f.cloudfront.net/310519663230880244/ZiFCrviuw9tzbL8mdF3mvw/mentorship-connection-ggWJv6FwWTNkzKojkVxUDi.webp";
  const businessImage = "https://d2xsxph8kpxj0f.cloudfront.net/310519663230880244/ZiFCrviuw9tzbL8mdF3mvw/business-growth-5v2Qzv8ChZrVA7aXZEw2ag.webp";
  const communityImage = "https://d2xsxph8kpxj0f.cloudfront.net/310519663230880244/ZiFCrviuw9tzbL8mdF3mvw/community-network-2waX8oz58ZBogp96XLUDVb.webp";

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="ELA Impulsiona GO" className="h-14 w-auto" />
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex gap-8 items-center">
            <a href="#calculadora" className="text-yellow-500 font-semibold hover:text-yellow-600 transition">Calculadora</a>
            <a href="#mentorias" className="text-yellow-500 font-semibold hover:text-yellow-600 transition">Mentorias</a>
            <a href="#eventos" className="text-yellow-500 font-semibold hover:text-yellow-600 transition">Eventos</a>
            <a href="#comunidade" className="text-yellow-500 font-semibold hover:text-yellow-600 transition">Comunidade</a>
            <a href="https://wa.me/5562999999999" target="_blank" rel="noopener noreferrer" className="text-green-500 font-semibold hover:text-green-600 transition">
              WhatsApp
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-orange-100 p-4 space-y-3">
            <a href="#calculadora" className="block text-yellow-500 font-semibold hover:text-yellow-600">Calculadora</a>
            <a href="#mentorias" className="block text-yellow-500 font-semibold hover:text-yellow-600">Mentorias</a>
            <a href="#eventos" className="block text-yellow-500 font-semibold hover:text-yellow-600">Eventos</a>
            <a href="#comunidade" className="block text-yellow-500 font-semibold hover:text-yellow-600">Comunidade</a>
            <a href="https://wa.me/5562999999999" target="_blank" rel="noopener noreferrer" className="block text-green-500 font-semibold hover:text-green-600">WhatsApp</a>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container grid md:grid-cols-2 gap-8 items-center py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Mulheres <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-600">Impulsionando</span> o Futuro
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Plataforma completa de capacitação, mentorias e apoio para mulheres empreendedoras. Criamos e formalizamos pequenos negócios com autonomia econômica.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => setShowCalculator(true)}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
              >
                <Calculator className="mr-2" size={20} />
                Calcular Tributos
              </Button>
              <Button
                variant="outline"
                className="border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                Saiba Mais <ArrowRight className="ml-2" size={20} />
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <img
              src={heroImage}
              alt="Mulheres empreendedoras"
              className="rounded-2xl shadow-2xl w-full h-auto object-cover"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-orange-500/10 to-purple-600/10 pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* Calculator Section */}
      {showCalculator && (
        <section id="calculadora" className="bg-white py-16 md:py-24 border-t border-orange-100">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-bold text-gray-900">Calculadora de Tributos</h3>
                <button
                  onClick={() => setShowCalculator(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <TaxCalculator />
            </motion.div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Como Apoiamos Mulheres Empreendedoras
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Respondemos à pergunta: Como podemos apoiar mulheres na criação, formalização e gestão de pequenos negócios, contribuindo com sua autonomia econômica?
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: <Calculator className="w-8 h-8" />,
                title: "Calculadora Tributária",
                description: "Simule diferentes regimes (MEI, Simples, Lucro Presumido, Lucro Real) e escolha o melhor para seu negócio.",
                color: "from-orange-500 to-orange-600"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Mentorias",
                description: "Conecte-se com mentoras experientes que compartilham conhecimento e experiência de empreendedorismo.",
                color: "from-purple-500 to-purple-600"
              },
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: "Capacitação",
                description: "Acesso a cursos gratuitos do SEBRAE e conteúdos sobre gestão, marketing e formalização.",
                color: "from-pink-500 to-pink-600"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Comunidade",
                description: "Rede de mulheres empreendedoras para troca de experiências, networking e oportunidades.",
                color: "from-yellow-500 to-yellow-600"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition border border-gray-100"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} text-white flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentorship Section */}
      <section id="mentorias" className="py-16 md:py-24 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={mentorshipImage}
              alt="Mentorias"
              className="rounded-2xl shadow-xl w-full h-auto object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Mentorias Especializadas</h3>
            <p className="text-gray-600 mb-6">
              Conecte-se com mulheres que já trilharam o caminho do empreendedorismo. Nossas mentoras oferecem orientação prática sobre:
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Formalização e registro de negócios",
                "Gestão financeira e tributária",
                "Marketing e vendas",
                "Escalabilidade e crescimento",
                "Equilíbrio vida-trabalho"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  {item}
                </li>
              ))}
            </ul>
            <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white">
              Solicitar Mentoria <ArrowRight className="ml-2" size={20} />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Business Growth Section */}
      <section id="eventos" className="py-16 md:py-24">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Encontros e Palestras</h3>
            <p className="text-gray-600 mb-6">
              Participe de encontros presenciais e online no Hub Goiás com especialistas em empreendedorismo feminino:
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Palestras sobre empreendedorismo",
                "Workshops de capacitação prática",
                "Networking com outras empreendedoras",
                "Apresentação de casos de sucesso",
                "Acesso a oportunidades de negócio"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  {item}
                </li>
              ))}
            </ul>
            <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
              Ver Próximos Eventos <ArrowRight className="ml-2" size={20} />
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img
              src={businessImage}
              alt="Crescimento de negócios"
              className="rounded-2xl shadow-xl w-full h-auto object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Community Section */}
      <section id="comunidade" className="py-16 md:py-24 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={communityImage}
              alt="Comunidade"
              className="rounded-2xl shadow-xl w-full h-auto object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Nossa Comunidade</h3>
            <p className="text-gray-600 mb-6">
              Faça parte de uma rede de mulheres empreendedoras que se apoiam mutuamente. Compartilhe experiências, desafios e conquistas:
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Grupos de discussão temáticos",
                "Trocas de experiências e aprendizados",
                "Oportunidades de parcerias",
                "Suporte emocional e profissional",
                "Acesso a recursos e ferramentas"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  {item}
                </li>
              ))}
            </ul>
            <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white">
              Junte-se à Comunidade <ArrowRight className="ml-2" size={20} />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Blog/Posts Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Conteúdo e Inspiração
            </h3>
            <p className="text-lg text-gray-600">
              Leia histórias de sucesso e dicas práticas de empreendedorismo
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "5 Passos para Formalizar seu Negócio",
                excerpt: "Guia completo sobre como regularizar sua empresa e aproveitar os benefícios de ser MEI.",
                category: "Formalização",
                date: "28 de Março, 2026"
              },
              {
                title: "Gestão Financeira para Pequenos Negócios",
                excerpt: "Aprenda a controlar suas finanças e tomar decisões baseadas em dados.",
                category: "Gestão",
                date: "25 de Março, 2026"
              },
              {
                title: "Histórias de Sucesso: Mulheres que Transformaram Vidas",
                excerpt: "Conheça as histórias inspiradoras de empreendedoras que conseguiram seu espaço no mercado.",
                category: "Inspiração",
                date: "22 de Março, 2026"
              }
            ].map((post, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition border border-gray-100 cursor-pointer group"
              >
                <div className="inline-block px-3 py-1 bg-orange-100 text-orange-600 text-xs font-semibold rounded-full mb-3">
                  {post.category}
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition">
                  {post.title}
                </h4>
                <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                <p className="text-xs text-gray-500">{post.date}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-orange-500 to-purple-600">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pronta para Impulsionar seu Negócio?
            </h3>
            <p className="text-lg text-orange-100 mb-8 max-w-2xl mx-auto">
              Junte-se a centenas de mulheres que já estão transformando suas vidas através do empreendedorismo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setShowTypebot(true)}
                className="bg-white text-orange-600 hover:bg-orange-50 font-semibold"
              >
                Começar Agora <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Saiba Mais
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Typebot Bubble */}
      {showTypebot && (
        <div>
          <TypebotWidget 
            typebotId="ela-impulsiona-go" 
            isOpen={showTypebot}
          />
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">ELA Impulsiona GO</h4>
              <p className="text-sm">Plataforma de empoderamento e capacitação para mulheres empreendedoras.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Plataforma</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Calculadora</a></li>
                <li><a href="#" className="hover:text-white transition">Mentorias</a></li>
                <li><a href="#" className="hover:text-white transition">Eventos</a></li>
                <li><a href="#" className="hover:text-white transition">Comunidade</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Recursos</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">SEBRAE</a></li>
                <li><a href="#" className="hover:text-white transition">Hub Goiás</a></li>
                <li><a href="#" className="hover:text-white transition">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Redes Sociais</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition">WhatsApp</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 ELA Impulsiona GO. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Typebot Global Script */}
      <script src="https://cdn.jsdelivr.net/npm/@typebot.io/js@latest" async></script>
      <script>
        {`
          if (window.Typebot) {
            window.Typebot.initBubble({
              typebot: 'ela-impulsiona-go',
              theme: {
                button: { backgroundColor: '#f97316', iconColor: '#ffffff' },
              },
            });
          }
        `}
      </script>
    </div>
  );
}
