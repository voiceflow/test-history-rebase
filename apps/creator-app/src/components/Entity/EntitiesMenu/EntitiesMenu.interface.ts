import type { Entity } from '@voiceflow/dtos';

export interface IEntitiesMenu {
  width?: number;
  onSelect: (entity: Entity) => void;
  maxHeight?: number;
  excludedEntitiesIDs?: string[];
}
