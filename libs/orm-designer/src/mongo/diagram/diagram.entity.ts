import { Entity, PrimaryKeyType, Property, Unique } from '@mikro-orm/core';
import type { ObjectId } from '@mikro-orm/mongodb';
import type { DiagramMenuItem, DiagramNode, DiagramType } from '@voiceflow/dtos';

import { MongoEntity } from '@/mongo/common';

@Entity({ collection: 'diagrams' })
@Unique({ properties: ['diagramID', 'versionID'] })
export class DiagramEntity extends MongoEntity {
  @Property()
  name!: string;

  @Property({ nullable: true })
  type?: DiagramType;

  @Property()
  zoom!: number;

  @Property()
  nodes!: Record<string, DiagramNode>;

  @Property()
  offsetX!: number;

  @Property()
  offsetY!: number;

  @Property()
  modified!: number;

  /**
   * @deprecated probably some legacy stuff and never used
   */

  @Property({ nullable: true })
  children?: string[];

  @Property()
  diagramID!: ObjectId;

  @Property()
  versionID!: ObjectId;

  @Property()
  creatorID!: number;

  @Property()
  variables!: string[];

  /**
   * @deprecated not used anymore
   */
  @Property({ nullable: true })
  menuItems?: DiagramMenuItem[];

  /**
   * @deprecated use `menuItems` instead
   */
  @Property({ nullable: true })
  menuNodeIDs?: string[];

  /**
   * @deprecated use `menuNodeIDs` instead
   */
  @Property({ nullable: true })
  intentStepIDs?: string[];

  [PrimaryKeyType]?: { diagramID: string; versionID: string };
}
