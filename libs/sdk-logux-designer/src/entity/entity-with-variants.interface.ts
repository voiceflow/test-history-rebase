import type { Entity } from './entity.interface';
import type { EntityVariant } from './entity-variant/entity-variant.interface';

export interface EntityWithVariants extends Entity {
  variants: EntityVariant[];
}
