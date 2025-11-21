import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      {/* Header */}
      <header className="bg-white border-b border-[#E5DCC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-[#8B7355]" />
              <h1 className="text-3xl font-bold text-[#5C4A3A]">LOOKia</h1>
            </div>
            <Button asChild className="bg-[#8B7355] hover:bg-[#6F5B45] text-white rounded-full">
              <Link href="/auth">Entrar</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-[#5C4A3A]">
            Seu Guarda-Roupa Digital
          </h2>
          <p className="text-xl text-[#8B7355] max-w-3xl mx-auto">
            Cadastre suas roupas, crie looks incríveis com IA, planeje eventos e compartilhe com a comunidade de moda.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Button asChild size="lg" className="bg-[#8B7355] hover:bg-[#6F5B45] text-white rounded-full px-8">
              <Link href="/auth">Começar Agora</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white rounded-full px-8">
              <Link href="#features">Saiba Mais</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5DCC8]">
            <div className="w-12 h-12 bg-[#F5F1E8] rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">👔</span>
            </div>
            <h3 className="text-xl font-bold text-[#5C4A3A] mb-2">Guarda-Roupa Virtual</h3>
            <p className="text-[#8B7355]">
              Cadastre todas as suas roupas, calçados, acessórios e perfumes. Organize por categoria, cor e ocasião.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5DCC8]">
            <div className="w-12 h-12 bg-[#F5F1E8] rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-xl font-bold text-[#5C4A3A] mb-2">IA de Moda</h3>
            <p className="text-[#8B7355]">
              Gere imagens realistas de você usando diferentes combinações. Compare até 4 looks e receba sugestões personalizadas.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5DCC8]">
            <div className="w-12 h-12 bg-[#F5F1E8] rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="text-xl font-bold text-[#5C4A3A] mb-2">Agenda de Eventos</h3>
            <p className="text-[#8B7355]">
              Planeje seus looks para eventos futuros. Receba lembretes e sugestões baseadas na ocasião.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5DCC8]">
            <div className="w-12 h-12 bg-[#F5F1E8] rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-xl font-bold text-[#5C4A3A] mb-2">Comunidade</h3>
            <p className="text-[#8B7355]">
              Compartilhe seus looks, peça opiniões e inspire-se com outros usuários apaixonados por moda.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5DCC8]">
            <div className="w-12 h-12 bg-[#F5F1E8] rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-xl font-bold text-[#5C4A3A] mb-2">Desapego</h3>
            <p className="text-[#8B7355]">
              Venda itens que não usa mais para outros usuários. Renove seu guarda-roupa de forma sustentável.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5DCC8]">
            <div className="w-12 h-12 bg-[#F5F1E8] rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🛍️</span>
            </div>
            <h3 className="text-xl font-bold text-[#5C4A3A] mb-2">Lojas Parceiras</h3>
            <p className="text-[#8B7355]">
              Experimente virtualmente itens de lojas parceiras e compre com descontos exclusivos.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-[#8B7355] to-[#6F5B45] rounded-3xl p-12 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pronto para revolucionar seu guarda-roupa?
          </h3>
          <p className="text-xl text-white/90 mb-8">
            Junte-se a milhares de pessoas que já transformaram a forma de se vestir.
          </p>
          <Button asChild size="lg" className="bg-white text-[#8B7355] hover:bg-gray-100 rounded-full px-8">
            <Link href="/auth">Criar Conta Grátis</Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5DCC8] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-[#8B7355]">
            <p>© 2024 LOOKia. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
