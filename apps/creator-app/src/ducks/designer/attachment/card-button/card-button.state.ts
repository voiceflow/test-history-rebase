import type { CardButton } from '@voiceflow/sdk-logux-designer';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'card_button';

export interface CardButtonState extends Normalized<CardButton> {}
