import type { Entity } from '@voiceflow/dtos';

export interface IEntityMenu {
  width?: number;
  onSelect: (entity: Entity) => void;
  maxHeight?: number;
  excludeEntitiesIDs?: string[];
}
