import type { RequiredEntity } from '@voiceflow/sdk-logux-designer';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'required_entity';

export interface RequiredEntityState extends Normalized<RequiredEntity> {}
