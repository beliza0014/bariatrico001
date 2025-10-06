import React from 'react';
import { Button } from "@/components/ui/button";
import { useQuiz } from '@/contexts/QuizContext';
const Page25cConfirmation = () => {
  const {
    nextPage,
    userInfo
  } = useQuiz();
  return <div className="min-h-screen bg-gradient-to-br from-success/5 via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center space-y-6">
          {/* Topo em destaque */}
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
              Ótima escolha, {userInfo.name}!
            </h1>
            
            {/* Texto guia */}
            <p className="text-lg font-semibold text-foreground">Você está a 2 passos do seu plano:</p>
            
            {/* Checklist */}
            <div className="text-left max-w-md mx-auto space-y-3 bg-background/50 rounded-xl p-6">
              <p className="text-foreground text-lg">
                1️⃣ Escolha qual corpo você deseja
              </p>
              <p className="text-foreground text-lg">
                2️⃣ Assista ao Vídeo e Finalize o pagamento seguro (de <span className="line-through">R$ 97,00</span> por <span className="text-success font-semibold">R$ 37,90</span>)
              </p>
              <p className="text-foreground text-lg">✅ Assim que o pagamento for confirmado, você tem acesso imediato no WhatsApp ou E-mail</p>
            </div>
            
            {/* Tempo estimado */}
            <p className="text-sm text-muted-foreground">
              Leva menos de 2 minutos
            </p>
          </div>

          <Button onClick={nextPage} className="w-full bg-success hover:bg-success/90 text-white font-semibold py-6 text-lg rounded-full shadow-lg transition-all duration-300 hover:scale-105">
            Continuar
          </Button>
        </div>
      </div>
    </div>;
};
export default Page25cConfirmation;