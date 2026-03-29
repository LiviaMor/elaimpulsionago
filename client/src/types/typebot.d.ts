declare module "@typebot.io/react" {
  import { FC, CSSProperties } from "react";

  interface StandardProps {
    typebot: string;
    apiHost?: string;
    style?: CSSProperties;
    isPreview?: boolean;
    prefilledVariables?: Record<string, unknown>;
    onNewInputBlock?: (inputBlock: any) => void;
    onAnswer?: (answer: { message: string; blockId: string }) => void;
    onInit?: () => void;
    onEnd?: () => void;
  }

  export const Standard: FC<StandardProps>;
  export const Bubble: FC<any>;
  export const Popup: FC<any>;
}
