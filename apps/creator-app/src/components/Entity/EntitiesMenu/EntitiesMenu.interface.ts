import type { Entity } from '@voiceflow/sdk-logux-designer';

export interface IEntitiesMenu {
  width?: number;
  onSelect: (entity: Entity) => void;
  maxHeight?: number;
  excludedEntitiesIDs?: string[];
}
