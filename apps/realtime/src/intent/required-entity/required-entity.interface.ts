import type { RequiredEntity, RequiredEntityCreate } from '@voiceflow/dtos';
import type { SetRequired } from 'type-fest';

export type RequiredEntityCreateData = RequiredEntityCreate &
  SetRequired<Pick<RequiredEntity, 'intentID' | 'assistantID' | 'environmentID'>, 'assistantID' | 'environmentID'>;
