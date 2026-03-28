import { useEffect } from "react";

interface TypebotWidgetProps {
  typebotId: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function TypebotWidget({ typebotId, isOpen = true }: TypebotWidgetProps) {
  useEffect(() => {
    if (!isOpen) return;

    // Carregar o script do Typebot
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@typebot.io/js@latest";
    script.async = true;
    script.onload = () => {
      if (window.Typebot) {
        window.Typebot.initBubble({
          typebot: typebotId,
          theme: {
            button: { backgroundColor: "#f97316", iconColor: "#ffffff" },
            chatWindow: {
              welcomeMessage: "Bem-vinda ao ELA Impulsiona GO! 👋",
              backgroundColor: "#ffffff",
              textColor: "#1f2937",
              headerBackgroundColor: "#f97316",
            },
          },
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [typebotId, isOpen]);

  return null;
}

// Declarar tipos globais para o Typebot
declare global {
  interface Window {
    Typebot?: {
      initBubble: (config: any) => void;
      close: () => void;
      open: () => void;
    };
  }
}
