import type { Entity } from '@voiceflow/dtos';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'entity';

export interface EntityState extends Normalized<Entity> {}
