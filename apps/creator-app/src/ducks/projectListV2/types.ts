import type * as Realtime from '@voiceflow/realtime-sdk';

import type { CRUDState } from '@/ducks/utils/crudV2';

export interface ProjectListState extends CRUDState<Realtime.ProjectList> {}
