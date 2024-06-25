import type { Utterance } from '@voiceflow/dtos';

import type { AIGenerateTextResponseVariant } from '@/components/AI/ai.interface';
import type { IResponseCreateVariant } from '@/components/Response/ResponseCreateVariant/ResponseCreateVariant.interface';

export interface IIntentRequiredEntityRepromptsPopper {
  children: React.ReactNode;
  entityID: string;
  entityIDs: string[];
  reprompts: IResponseCreateVariant['variant'][];
  entityName: string;
  intentName: string;
  utterances: Pick<Utterance, 'text'>[];
  onRepromptAdd: VoidFunction;
  onEntityReplace: (props: { oldEntityID: string; entityID: string }) => void;
  onRepromptsGenerated: (reprompts: AIGenerateTextResponseVariant[]) => void;
}
