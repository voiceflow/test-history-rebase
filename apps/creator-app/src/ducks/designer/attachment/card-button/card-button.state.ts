import type { CardButton } from '@voiceflow/dtos';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'card_button';

export interface CardButtonState extends Normalized<CardButton> {}
