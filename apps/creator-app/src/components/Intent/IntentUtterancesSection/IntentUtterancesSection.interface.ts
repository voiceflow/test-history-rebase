import type { Utterance } from '@voiceflow/dtos';

export interface IIntentUtterancesSection {
  utterances: Pick<Utterance, 'id' | 'text'>[];
  autoFocusKey?: string;
  onUtteranceAdd: VoidFunction;
  onUtteranceEmpty: (index: number) => (isEmpty: boolean) => void;
  onUtteranceDelete: (id: string) => void;
  onUtteranceChange: (id: string, data: Pick<Utterance, 'text'>) => void;
  autoScrollToTopRevision?: string;
}
