import type { Entity } from '@voiceflow/sdk-logux-designer';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'entity';

export interface EntityState extends Normalized<Entity> {}
