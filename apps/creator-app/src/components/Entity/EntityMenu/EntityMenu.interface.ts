import type { Entity } from '@voiceflow/dtos';

export interface IEntityMenu {
  width?: number;
  onClose: VoidFunction;
  onSelect: (entity: Entity) => void;
  excludeEntitiesIDs?: string[];
}
