"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [isConfigured, setIsConfigured] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Verificar se o Supabase está configurado
    const checkConfig = async () => {
      try {
        // Verificar se as variáveis de ambiente existem
        if (!supabase) {
          setIsConfigured(false);
          setIsChecking(false);
          return;
        }

        // Tentar verificar sessão com timeout
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 3000)
        );
        
        const sessionPromise = supabase.auth.getSession();
        
        const { data, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;

        if (error) {
          setIsConfigured(false);
          setIsChecking(false);
          return;
        }

        setIsConfigured(true);
        
        if (data?.session) {
          router.push("/onboarding");
        }
      } catch (err) {
        console.error('Erro ao verificar configuração:', err);
        setIsConfigured(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkConfig();

    // Listener de autenticação apenas se configurado
    let authListener: any = null;
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (session) {
            router.push("/onboarding");
          }
        }
      );
      authListener = data;
    }

    return () => {
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50">
        <div className="text-pink-600 text-lg font-semibold animate-pulse">Carregando...</div>
      </div>
    );
  }

  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50">
        <div className="max-w-md w-full px-6">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-orange-300">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                ⚠️ Configuração Necessária
              </h2>
              <p className="text-gray-600 mb-6">
                As variáveis de ambiente do Supabase não estão configuradas. 
                Clique no banner laranja acima para configurar suas credenciais.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50">
      <div className="max-w-md w-full px-6">
        {/* Logo e Tagline */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 via-purple-500 to-rose-500 rounded-3xl flex items-center justify-center shadow-2xl transform hover:rotate-12 transition-transform duration-300">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-500 opacity-20 blur-xl rounded-full"></div>
            </div>
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent mb-3">
            LOOKia ✨
          </h1>
          <p className="text-xl text-gray-700 font-semibold">
            Sua moda, seu estilo, sua IA.
          </p>
        </div>

        {/* Card de Autenticação */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-200">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Bem-vindo! 💕
            </h2>
            <p className="text-sm text-gray-600 font-medium">
              Entre ou crie sua conta para começar sua jornada fashion
            </p>
          </div>
          
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#ec4899',
                    brandAccent: '#db2777',
                    brandButtonText: 'white',
                    defaultButtonBackground: '#fdf2f8',
                    defaultButtonBackgroundHover: '#fce7f3',
                    inputBackground: '#fdf2f8',
                    inputBorder: '#fbcfe8',
                    inputBorderHover: '#ec4899',
                    inputBorderFocus: '#ec4899',
                  },
                  borderWidths: {
                    buttonBorderWidth: '2px',
                    inputBorderWidth: '2px',
                  },
                  radii: {
                    borderRadiusButton: '9999px',
                    buttonBorderRadius: '9999px',
                    inputBorderRadius: '12px',
                  },
                },
              },
              className: {
                container: 'space-y-4',
                button: 'rounded-full font-bold',
                input: 'rounded-xl',
              },
            }}
            providers={["google"]}
            redirectTo={`${window.location.origin}/auth/callback`}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'E-mail',
                  password_label: 'Senha',
                  button_label: 'Entrar',
                  loading_button_label: 'Entrando...',
                  link_text: 'Já tem uma conta? Entre',
                },
                sign_up: {
                  email_label: 'E-mail',
                  password_label: 'Senha',
                  button_label: 'Criar conta',
                  loading_button_label: 'Criando conta...',
                  link_text: 'Não tem uma conta? Cadastre-se',
                },
              },
            }}
          />
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6 font-medium">
          Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade
        </p>
      </div>
    </div>
  );
}
