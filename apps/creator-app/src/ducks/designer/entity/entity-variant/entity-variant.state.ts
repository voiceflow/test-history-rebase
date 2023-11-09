import type { EntityVariant } from '@voiceflow/dtos';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'variant';

export interface EntityVariantState extends Normalized<EntityVariant> {}
