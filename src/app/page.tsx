import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
      <div className="text-center space-y-8">
        <h1 className="text-6xl font-bold text-gray-800">Fashion Look App</h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Crie looks incríveis com sua IA pessoal de moda. Cadastre suas roupas, gere imagens de looks e compartilhe com a comunidade.
        </p>
        <div className="space-x-4">
          <Button asChild size="lg">
            <Link href="/auth">Começar</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/about">Sobre</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}