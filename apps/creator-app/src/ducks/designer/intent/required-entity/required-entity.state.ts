import type { RequiredEntity } from '@voiceflow/dtos';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'required_entity';

export interface RequiredEntityState extends Normalized<RequiredEntity> {}
