import type { Enum } from '@voiceflow/dtos';

export const ModalScope = {
  PROJECT: 'project',
} as const;

export type ModalScope = Enum<typeof ModalScope>;
