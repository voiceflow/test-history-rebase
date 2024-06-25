import type * as Platform from '@voiceflow/platform-config';

import type { CRUDState } from '@/ducks/utils/crudV2';

export interface VersionState extends CRUDState<Platform.Base.Models.Version.Model> {}
