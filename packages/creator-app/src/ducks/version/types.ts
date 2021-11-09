import * as Realtime from '@voiceflow/realtime-sdk';

import { CRUDState } from '@/ducks/utils/crud';

export type VersionState = CRUDState<Realtime.AnyVersion>;
