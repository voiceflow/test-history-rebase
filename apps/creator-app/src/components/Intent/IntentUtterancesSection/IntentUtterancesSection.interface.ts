import type { Utterance, UtteranceText } from '@voiceflow/sdk-logux-designer';

export interface IIntentUtterancesSection {
  utterances: Pick<Utterance, 'id' | 'text'>[];
  autoFocusKey?: string;
  onUtteranceAdd: (data?: { text?: UtteranceText }) => void;
  onUtteranceEmpty: (index: number) => (isEmpty: boolean) => void;
  onUtteranceDelete: (id: string) => void;
  onUtteranceChange: (id: string, data: Pick<Utterance, 'text'>) => void;
  autoScrollToTopRevision?: string;
}
