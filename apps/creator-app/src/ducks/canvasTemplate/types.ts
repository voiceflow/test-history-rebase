import type * as Realtime from '@voiceflow/realtime-sdk';

import type { CreatorState } from '@/ducks/creatorV2/types';
import type { CRUDState } from '@/ducks/utils/crudV2';

export interface CanvasTemplateState extends CRUDState<Realtime.CanvasTemplate>, CreatorState {}
