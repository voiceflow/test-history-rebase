import type { Intent, RequiredEntity } from '@voiceflow/dtos';

export interface IIntentEditRequiredEntityItem {
  intent: Intent;
  entityIDs: string[];
  requiredEntity: RequiredEntity;
}
