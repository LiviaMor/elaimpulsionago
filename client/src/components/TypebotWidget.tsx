import { Standard } from "@typebot.io/react";

interface TypebotWidgetProps {
  typebotId: string;
  height?: string;
}

export default function TypebotWidget({
  typebotId,
  height = "600px",
}: TypebotWidgetProps) {
  return (
    <Standard
      typebot={typebotId}
      apiHost="https://typebot.co"
      style={{ width: "100%", height }}
    />
  );
}
