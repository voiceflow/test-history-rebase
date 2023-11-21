import type { WithAdditionalProperties } from '@/types';

export type ProgramLine = WithAdditionalProperties<{
  id: string;
  type: string;
}>;
