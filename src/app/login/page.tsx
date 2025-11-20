'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Crown } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se já está autenticado
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/');
      } else {
        setLoading(false);
      }
    });

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.push('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF6F20]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center p-4">
      {/* Logo e Header */}
      <div className="mb-8 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#FF6F20] to-[#CC5500] flex items-center justify-center shadow-2xl">
          <Crown className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Domin8</h1>
        <p className="text-[#A0A0A0] text-lg">Domine sua cidade</p>
      </div>

      {/* Frases Épicas */}
      <div className="mb-8 text-center max-w-md">
        <p className="text-white text-xl font-bold mb-2">
          "Seu território, suas regras."
        </p>
        <p className="text-[#A0A0A0]">
          Transforme exercício em conquista territorial
        </p>
      </div>

      {/* Card de Login */}
      <div className="w-full max-w-md bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 shadow-2xl">
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#FF6F20',
                  brandAccent: '#CC5500',
                  brandButtonText: 'white',
                  defaultButtonBackground: '#1A1A1A',
                  defaultButtonBackgroundHover: '#2A2A2A',
                  defaultButtonBorder: '#2A2A2A',
                  defaultButtonText: 'white',
                  dividerBackground: '#2A2A2A',
                  inputBackground: '#0D0D0D',
                  inputBorder: '#2A2A2A',
                  inputBorderHover: '#FF6F20',
                  inputBorderFocus: '#FF6F20',
                  inputText: 'white',
                  inputLabelText: '#A0A0A0',
                  inputPlaceholder: '#666666',
                  messageText: 'white',
                  messageTextDanger: '#FF4444',
                  anchorTextColor: '#FF6F20',
                  anchorTextHoverColor: '#CC5500',
                },
                space: {
                  spaceSmall: '8px',
                  spaceMedium: '16px',
                  spaceLarge: '24px',
                },
                fontSizes: {
                  baseBodySize: '14px',
                  baseInputSize: '14px',
                  baseLabelSize: '14px',
                  baseButtonSize: '14px',
                },
                fonts: {
                  bodyFontFamily: `'Inter', sans-serif`,
                  buttonFontFamily: `'Inter', sans-serif`,
                  inputFontFamily: `'Inter', sans-serif`,
                  labelFontFamily: `'Inter', sans-serif`,
                },
                borderWidths: {
                  buttonBorderWidth: '1px',
                  inputBorderWidth: '1px',
                },
                radii: {
                  borderRadiusButton: '12px',
                  buttonBorderRadius: '12px',
                  inputBorderRadius: '12px',
                },
              },
            },
            className: {
              container: 'auth-container',
              button: 'auth-button',
              input: 'auth-input',
              label: 'auth-label',
            },
          }}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email',
                password_label: 'Senha',
                email_input_placeholder: 'seu@email.com',
                password_input_placeholder: 'Sua senha',
                button_label: 'Entrar',
                loading_button_label: 'Entrando...',
                social_provider_text: 'Entrar com {{provider}}',
                link_text: 'Já tem uma conta? Entre',
              },
              sign_up: {
                email_label: 'Email',
                password_label: 'Senha',
                email_input_placeholder: 'seu@email.com',
                password_input_placeholder: 'Sua senha',
                button_label: 'Criar conta',
                loading_button_label: 'Criando conta...',
                social_provider_text: 'Entrar com {{provider}}',
                link_text: 'Não tem uma conta? Cadastre-se',
              },
              forgotten_password: {
                email_label: 'Email',
                password_label: 'Senha',
                email_input_placeholder: 'seu@email.com',
                button_label: 'Enviar instruções',
                loading_button_label: 'Enviando...',
                link_text: 'Esqueceu sua senha?',
              },
              update_password: {
                password_label: 'Nova senha',
                password_input_placeholder: 'Sua nova senha',
                button_label: 'Atualizar senha',
                loading_button_label: 'Atualizando...',
              },
            },
          }}
          providers={[]}
          redirectTo={typeof window !== 'undefined' ? window.location.origin : ''}
        />
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-[#666666] text-sm">
          Ao criar uma conta, você concorda com nossos Termos e Política de Privacidade
        </p>
      </div>
    </div>
  );
}
