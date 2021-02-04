import { Board, Creator, Error } from '@/admin/models';
import { NonNullishRecord } from '@/types';

export enum THEMES {
  light = 'LIGHT',
  dark = 'DARK',
  unicorn = 'UNICORN',
}

export type AdminState = {
  creator: Creator | NonNullishRecord<Record<string, unknown>>;
  betaCreator: Creator | NonNullishRecord<Record<string, unknown>>;
  boards: Board[];
  charges: any[];
  vendors: any[];
  error: Error;
  dark: boolean;
  theme: THEMES;
};
