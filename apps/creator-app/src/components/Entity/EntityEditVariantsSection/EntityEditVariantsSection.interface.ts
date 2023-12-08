import { Entity } from '@voiceflow/dtos';

export interface IEntityEditVariantsSection {
  entity: Entity;
  variantsError?: string | null;
  resetVariantsError?: VoidFunction;
}
