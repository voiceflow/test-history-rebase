import type { AnyResponseVariantCreateData } from '@/main';

import type { RelationshipResource } from '../../common';

interface RequiredEntityData {
  entityID: string;
  repromptID: string | null;
}

export interface RequiredEntity extends RelationshipResource, RequiredEntityData {
  intentID: string;
  assistantID: string;
}

export type RequiredEntityCreateData = Omit<RequiredEntityData, 'repromptID'> &
  (Pick<RequiredEntityData, 'repromptID'> | { reprompts: AnyResponseVariantCreateData[] });
