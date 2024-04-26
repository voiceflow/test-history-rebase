import type { Enum } from '@voiceflow/dtos';

export const IntentTableColumn = {
  NAME: 'name',
  FLOWS: 'flows',
  SELECT: 'select',
  UPDATED: 'updated',
  CLARITY: 'clarity',
  CONFIDENCE: 'confidence',
  DESCRIPTION: 'description',
  LAST_EDITOR: 'last-editor',
} as const;

export type IntentTableColumn = Enum<typeof IntentTableColumn>;
