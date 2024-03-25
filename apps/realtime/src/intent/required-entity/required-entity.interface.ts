import type { RequiredEntity, RequiredEntityCreate } from '@voiceflow/dtos';

export type RequiredEntityCreateData = RequiredEntityCreate & Pick<RequiredEntity, 'intentID'> & { id?: string };
