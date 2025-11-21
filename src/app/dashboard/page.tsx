"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shirt, Calendar, Users, ShoppingBag, Heart, Sparkles, TrendingUp, Settings, MessageCircle, CalendarDays } from "lucide-react";

interface UserProfile {
  first_name: string;
  last_name: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        // Verificar se Supabase está configurado
        if (!supabase) {
          console.error('Supabase não configurado');
          router.push("/auth");
          return;
        }

        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Erro ao buscar usuário:', error);
          router.push("/auth");
          return;
        }

        if (!user) {
          router.push("/auth");
          return;
        }

        setUser(user);
        
        // Buscar perfil do usuário
        try {
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('first_name, last_name')
            .eq('user_id', user.id)
            .single();
          
          if (profileError) {
            // Se a tabela não existe (PGRST205), mostrar mensagem específica
            if (profileError.code === 'PGRST205') {
              setProfileError('A tabela de perfis ainda não foi criada no banco de dados.');
              console.warn('Tabela user_profiles não encontrada.');
            } else if (profileError.code === 'PGRST116') {
              // Perfil não existe ainda - não é erro crítico
              console.log('Perfil ainda não criado para este usuário');
              setProfileError(null);
            } else {
              console.warn('Erro ao buscar perfil:', profileError);
            }
          } else if (profile) {
            setUserProfile(profile);
            setProfileError(null);
          }
        } catch (err) {
          console.warn('Erro ao buscar perfil:', err);
        }
      } catch (err) {
        console.error('Erro geral:', err);
        router.push("/auth");
      } finally {
        setLoading(false);
      }
    };
    
    getUser();
  }, [router]);

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/");
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 flex items-center justify-center">
      <div className="text-pink-600 text-lg font-semibold animate-pulse">Carregando...</div>
    </div>
  );

  if (!user) return null;

  // Pegar o primeiro nome do perfil ou do email como fallback
  const firstName = userProfile?.first_name || user.email?.split('@')[0] || "Usuária";

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50">
      {/* Header com gradiente feminino vibrante */}
      <header className="bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 border-b-4 border-pink-300 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center shadow-2xl transform hover:rotate-12 transition-transform duration-300">
                <Sparkles className="w-8 h-8 text-pink-500" />
              </div>
              <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
                LOOKia ✨
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="text-white hover:bg-white/20 rounded-full w-12 h-12 p-0 backdrop-blur-sm">
                <Settings className="w-6 h-6" />
              </Button>
              <Button 
                onClick={handleLogout} 
                className="bg-white text-pink-600 hover:bg-pink-50 rounded-full px-8 py-3 shadow-2xl transition-all duration-300 hover:scale-110 font-bold"
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Alerta de erro de perfil - APENAS se tabela não existe */}
        {profileError && (
          <div className="mb-8 bg-orange-100 border-4 border-orange-300 rounded-3xl p-6 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-orange-800 mb-2">Configuração Necessária</h3>
                <p className="text-orange-700 font-medium mb-4">{profileError}</p>
                <div className="bg-white rounded-2xl p-4 border-2 border-orange-200">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Execute este SQL no SQL Editor do Supabase:</p>
                  <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-x-auto border border-gray-200">
{`CREATE TABLE public.user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  age INTEGER,
  height NUMERIC(5,2),
  weight NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
  ON public.user_profiles FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" 
  ON public.user_profiles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
  ON public.user_profiles FOR UPDATE 
  USING (auth.uid() = user_id);`}
                  </pre>
                  <p className="text-xs text-gray-600 mt-3">
                    💡 Acesse: Dashboard do Supabase → SQL Editor → Cole o código acima → Execute
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Welcome Section com gradiente */}
        <div className="mb-12 bg-gradient-to-r from-pink-100 via-purple-100 to-rose-100 rounded-3xl p-8 shadow-xl border-4 border-pink-200">
          <h2 className="text-5xl font-extrabold bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent mb-4">
            Olá, {firstName}! 💕✨
          </h2>
          <p className="text-xl text-gray-700 font-semibold">
            Bem-vinda ao seu guarda-roupa digital
          </p>
        </div>

        {/* Stats Cards com cores vibrantes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="bg-gradient-to-br from-pink-400 to-rose-500 rounded-3xl p-8 shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 hover:-translate-y-3 border-4 border-pink-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/90 mb-2 font-bold uppercase tracking-wide">Total de Itens</p>
                <p className="text-5xl font-extrabold text-white drop-shadow-lg">0</p>
              </div>
              <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl">
                <Shirt className="w-9 h-9 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:-translate-y-3 border-4 border-purple-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/90 mb-2 font-bold uppercase tracking-wide">Looks Criados</p>
                <p className="text-5xl font-extrabold text-white drop-shadow-lg">0</p>
              </div>
              <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl">
                <Heart className="w-9 h-9 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-rose-400 to-orange-500 rounded-3xl p-8 shadow-2xl hover:shadow-rose-500/50 transition-all duration-300 hover:-translate-y-3 border-4 border-rose-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/90 mb-2 font-bold uppercase tracking-wide">Eventos</p>
                <p className="text-5xl font-extrabold text-white drop-shadow-lg">0</p>
              </div>
              <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl">
                <Calendar className="w-9 h-9 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:-translate-y-3 border-4 border-purple-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/90 mb-2 font-bold uppercase tracking-wide">Seguidoras</p>
                <p className="text-5xl font-extrabold text-white drop-shadow-lg">0</p>
              </div>
              <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl">
                <Users className="w-9 h-9 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Features Grid com bordas coloridas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Guarda-Roupa Digital */}
          <Card className="bg-white border-4 border-pink-300 rounded-3xl hover:shadow-2xl hover:shadow-pink-500/30 transition-all duration-300 hover:-translate-y-3 overflow-hidden group">
            <CardHeader className="pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-3xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Shirt className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-800 font-extrabold">Guarda-Roupa Digital</CardTitle>
              <CardDescription className="text-gray-600 text-base leading-relaxed font-medium">
                Cadastre roupas, calçados, relógios, perfumes, joias e acessórios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full py-7 text-lg shadow-2xl transition-all duration-300 hover:scale-105 font-bold">
                <Link href="/wardrobe">Gerenciar Itens</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Criador de Looks */}
          <Card className="bg-white border-4 border-purple-300 rounded-3xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-3 overflow-hidden group">
            <CardHeader className="pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-800 font-extrabold">Criador de Looks</CardTitle>
              <CardDescription className="text-gray-600 text-base leading-relaxed font-medium">
                Monte looks manualmente ou deixe a IA criar para você
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full py-7 text-lg shadow-2xl transition-all duration-300 hover:scale-105 font-bold">
                <Link href="/look-creator">Criar Look</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Meus Looks */}
          <Card className="bg-white border-4 border-rose-300 rounded-3xl hover:shadow-2xl hover:shadow-rose-500/30 transition-all duration-300 hover:-translate-y-3 overflow-hidden group">
            <CardHeader className="pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-500 rounded-3xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-800 font-extrabold">Meus Looks</CardTitle>
              <CardDescription className="text-gray-600 text-base leading-relaxed font-medium">
                Veja e gerencie seus looks salvos e favoritos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-full py-7 text-lg shadow-2xl transition-all duration-300 hover:scale-105 font-bold">
                <Link href="/my-looks">Ver Looks</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Agenda de Eventos */}
          <Card className="bg-white border-4 border-orange-300 rounded-3xl hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-3 overflow-hidden group">
            <CardHeader className="pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-rose-500 rounded-3xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Calendar className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-800 font-extrabold">Agenda de Eventos</CardTitle>
              <CardDescription className="text-gray-600 text-base leading-relaxed font-medium">
                Planeje looks para eventos e receba lembretes inteligentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white rounded-full py-7 text-lg shadow-2xl transition-all duration-300 hover:scale-105 font-bold">
                <Link href="/events">Ver Agenda</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Consultora LOOKia */}
          <Card className="bg-white border-4 border-purple-300 rounded-3xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-3 overflow-hidden group">
            <CardHeader className="pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-3xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-800 font-extrabold">Consultora LOOKia</CardTitle>
              <CardDescription className="text-gray-600 text-base leading-relaxed font-medium">
                Converse com sua assistente fashion e receba dicas personalizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-full py-7 text-lg shadow-2xl transition-all duration-300 hover:scale-105 font-bold">
                <Link href="/consultant">Conversar</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Comunidade */}
          <Card className="bg-white border-4 border-pink-300 rounded-3xl hover:shadow-2xl hover:shadow-pink-500/30 transition-all duration-300 hover:-translate-y-3 overflow-hidden group">
            <CardHeader className="pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-500 rounded-3xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Users className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-800 font-extrabold">Comunidade</CardTitle>
              <CardDescription className="text-gray-600 text-base leading-relaxed font-medium">
                Compartilhe looks, peça opiniões e inspire-se
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full py-7 text-lg shadow-2xl transition-all duration-300 hover:scale-105 font-bold">
                <Link href="/community">Explorar</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Desapego */}
          <Card className="bg-white border-4 border-rose-300 rounded-3xl hover:shadow-2xl hover:shadow-rose-500/30 transition-all duration-300 hover:-translate-y-3 overflow-hidden group">
            <CardHeader className="pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-orange-500 rounded-3xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <ShoppingBag className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-800 font-extrabold">Desapego</CardTitle>
              <CardDescription className="text-gray-600 text-base leading-relaxed font-medium">
                Venda itens que não usa mais para outras usuárias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white rounded-full py-7 text-lg shadow-2xl transition-all duration-300 hover:scale-105 font-bold">
                <Link href="/marketplace">Vender</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Lojas Parceiras */}
          <Card className="bg-white border-4 border-purple-300 rounded-3xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-3 overflow-hidden group">
            <CardHeader className="pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-800 font-extrabold">Lojas Parceiras</CardTitle>
              <CardDescription className="text-gray-600 text-base leading-relaxed font-medium">
                Experimente virtualmente itens de lojas parceiras
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full py-7 text-lg shadow-2xl transition-all duration-300 hover:scale-105 font-bold">
                <Link href="/partners">Ver Lojas</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Planejador Semanal */}
          <Card className="bg-white border-4 border-pink-300 rounded-3xl hover:shadow-2xl hover:shadow-pink-500/30 transition-all duration-300 hover:-translate-y-3 overflow-hidden group">
            <CardHeader className="pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-3xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <CalendarDays className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-800 font-extrabold">Planejador Semanal</CardTitle>
              <CardDescription className="text-gray-600 text-base leading-relaxed font-medium">
                Organize e planeje seus looks para a semana inteira
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full py-7 text-lg shadow-2xl transition-all duration-300 hover:scale-105 font-bold">
                <Link href="/weekly-planner">Planejar</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Estatísticas - Card especial com gradiente completo */}
          <Card className="bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 border-4 border-pink-300 rounded-3xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:-translate-y-3 overflow-hidden group">
            <CardHeader className="pb-4">
              <div className="w-20 h-20 bg-white/30 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-white font-extrabold drop-shadow-lg">Estatísticas</CardTitle>
              <CardDescription className="text-white/95 text-base leading-relaxed font-semibold">
                Veja insights sobre seu guarda-roupa e estilo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-white text-pink-600 hover:bg-pink-50 rounded-full py-7 text-lg shadow-2xl transition-all duration-300 font-extrabold hover:scale-105">
                <Link href="/stats">Ver Estatísticas</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Perfil e Configurações */}
          <Card className="bg-white border-4 border-purple-300 rounded-3xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-3 overflow-hidden group">
            <CardHeader className="pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Settings className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-800 font-extrabold">Perfil e Configurações</CardTitle>
              <CardDescription className="text-gray-600 text-base leading-relaxed font-medium">
                Personalize sua experiência e gerencie sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full py-7 text-lg shadow-2xl transition-all duration-300 hover:scale-105 font-bold">
                <Link href="/settings">Configurar</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
