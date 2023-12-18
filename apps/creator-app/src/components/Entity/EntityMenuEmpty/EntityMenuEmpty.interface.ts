import { Entity } from '@voiceflow/dtos';

export interface IEntityMenuEmpty {
  width?: number;
  onCreated?: (entity: Entity) => void;
}
