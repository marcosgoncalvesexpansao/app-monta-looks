"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Sparkles, User } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [tableError, setTableError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    height: "",
    weight: "",
    photos: [] as File[],
  });

  const handleNext = async () => {
    if (step === 1) {
      // Validar campos obrigatórios
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        alert("Por favor, preencha seu nome e sobrenome.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Salvar dados no Supabase
      if (!supabase) {
        alert("Supabase não configurado. Clique no banner laranja acima para configurar.");
        return;
      }

      setLoading(true);
      setTableError(null);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { error } = await supabase
            .from('user_profiles')
            .upsert({
              user_id: user.id,
              first_name: formData.firstName,
              last_name: formData.lastName,
              age: formData.age ? parseInt(formData.age) : null,
              height: formData.height ? parseFloat(formData.height) : null,
              weight: formData.weight ? parseFloat(formData.weight) : null,
              updated_at: new Date().toISOString(),
            });

          if (error) {
            // Verificar se é erro de tabela não existente
            if (error.code === 'PGRST205') {
              setTableError('A tabela de perfis ainda não foi criada no banco de dados.');
              console.error("Erro ao salvar perfil:", error);
              return;
            }
            console.error("Erro ao salvar perfil:", error);
            alert("Erro ao salvar perfil. Tente novamente.");
            return;
          }

          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao salvar perfil. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSkipToEnd = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      alert("Nome e sobrenome são obrigatórios!");
      return;
    }

    if (!supabase) {
      alert("Supabase não configurado. Clique no banner laranja acima para configurar.");
      return;
    }

    setLoading(true);
    setTableError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase
          .from('user_profiles')
          .upsert({
            user_id: user.id,
            first_name: formData.firstName,
            last_name: formData.lastName,
            updated_at: new Date().toISOString(),
          });

        if (error) {
          // Verificar se é erro de tabela não existente
          if (error.code === 'PGRST205') {
            setTableError('A tabela de perfis ainda não foi criada no banco de dados.');
            console.error("Erro ao salvar perfil:", error);
            return;
          }
          console.error("Erro ao salvar perfil:", error);
          alert("Erro ao salvar perfil. Tente novamente.");
          return;
        }

        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao salvar perfil. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Alerta de erro de tabela - APENAS se tabela não existe */}
        {tableError && (
          <div className="mb-8 bg-orange-100 border-4 border-orange-300 rounded-3xl p-6 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-orange-800 mb-2">Configuração Necessária</h3>
                <p className="text-orange-700 font-medium mb-4">{tableError}</p>
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

        <Card className="bg-white border-4 border-pink-300 rounded-3xl shadow-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 text-white text-center py-8">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
              <Sparkles className="w-10 h-10 text-pink-500" />
            </div>
            <CardTitle className="text-4xl font-extrabold">Bem-vinda ao LOOKia! ✨</CardTitle>
            <CardDescription className="text-pink-100 text-lg font-semibold">
              Vamos configurar seu perfil fashion
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Primeiro, seu nome</h3>
                  <p className="text-gray-600">Como você gostaria de ser chamada?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">Nome</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Seu primeiro nome"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="mt-1 rounded-full border-2 border-pink-200 focus:border-pink-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">Sobrenome</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Seu sobrenome"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="mt-1 rounded-full border-2 border-pink-200 focus:border-pink-400"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleNext}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full py-6 text-lg font-bold shadow-2xl"
                  >
                    Próximo
                  </Button>
                  <Button
                    onClick={handleSkipToEnd}
                    variant="outline"
                    className="flex-1 border-2 border-pink-300 text-pink-600 hover:bg-pink-50 rounded-full py-6 text-lg font-bold"
                  >
                    Pular para o fim
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Dados opcionais</h3>
                  <p className="text-gray-600">Essas informações ajudam a personalizar suas recomendações</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="age" className="text-sm font-semibold text-gray-700">Idade</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      className="mt-1 rounded-full border-2 border-pink-200 focus:border-pink-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-sm font-semibold text-gray-700">Altura (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      step="0.01"
                      placeholder="165.5"
                      value={formData.height}
                      onChange={(e) => setFormData({...formData, height: e.target.value})}
                      className="mt-1 rounded-full border-2 border-pink-200 focus:border-pink-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight" className="text-sm font-semibold text-gray-700">Peso (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="58.5"
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      className="mt-1 rounded-full border-2 border-pink-200 focus:border-pink-400"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1 border-2 border-pink-300 text-pink-600 hover:bg-pink-50 rounded-full py-6 text-lg font-bold"
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full py-6 text-lg font-bold shadow-2xl disabled:opacity-50"
                  >
                    {loading ? "Salvando..." : "Finalizar"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}