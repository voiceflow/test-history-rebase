import * as Platform from '@voiceflow/platform-config';

import { CRUDState } from '@/ducks/utils/crudV2';

export interface IntentState extends CRUDState<Platform.Base.Models.Intent.Model> {}
