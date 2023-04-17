import * as Realtime from '@voiceflow/realtime-sdk';

import { CreatorState } from '@/ducks/creatorV2/types';
import { CRUDState } from '@/ducks/utils/crudV2';

export interface CanvasTemplateState extends CRUDState<Realtime.CanvasTemplate>, CreatorState {}
