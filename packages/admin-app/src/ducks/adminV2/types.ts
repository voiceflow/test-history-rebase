import { NonNullishRecord } from '@voiceflow/common';

import { Board, Creator, Error } from '@/models';

export enum ThemeType {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
  UNICORN = 'UNICORN',
}

export interface AdminState {
  creator: Creator | NonNullishRecord<Record<string, unknown>>;
  betaCreator: Creator | NonNullishRecord<Record<string, unknown>>;
  boards: Board[];
  charges: any[];
  vendors: any[];
  error: Error;
  dark: boolean;
  theme: ThemeType;
}
