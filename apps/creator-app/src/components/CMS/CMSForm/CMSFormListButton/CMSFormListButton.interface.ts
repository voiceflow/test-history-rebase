import type { ISquareButton } from '@voiceflow/ui-next';

export interface ICMSFormListButton extends Omit<ISquareButton, 'size' | 'variant'> {}
