import { Entity, PrimaryKeyType, Property, Unique } from '@mikro-orm/core';
import type { ObjectId } from '@mikro-orm/mongodb';

import { cleanupUndefinedFields, MongoEntity } from '@/mongo/common';
import type { EntityCreateParams, ToJSON, ToJSONWithForeignKeys } from '@/types';

import { DiagramJSONAdapter } from './diagram.adapter';
import type { DiagramMenuItem } from './interfaces/diagram-menu-item.interface';
import type { DiagramNode } from './interfaces/diagram-node.interface';

@Entity({ collection: 'diagrams' })
@Unique({ properties: ['diagramID', 'versionID'] })
export class DiagramEntity extends MongoEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<DiagramEntity>>>(data: JSON) {
    return DiagramJSONAdapter.toDB<JSON>(data);
  }

  @Property()
  name: string;

  @Property({ nullable: true })
  type?: string;

  @Property()
  zoom: number;

  @Property()
  nodes: Record<string, DiagramNode>;

  @Property()
  offsetX: number;

  @Property()
  offsetY: number;

  @Property()
  modified: number;

  /**
   * @deprecated probably some legacy stuff and never used
   */

  @Property({ nullable: true })
  children?: string[];

  @Property()
  diagramID: ObjectId;

  @Property()
  versionID: ObjectId;

  @Property()
  creatorID: number;

  @Property()
  variables: string[];

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

  constructor({
    name,
    type,
    zoom,
    nodes,
    offsetX,
    offsetY,
    modified,
    children,
    diagramID,
    versionID,
    creatorID,
    variables,
    menuItems,
    menuNodeIDs,
    intentStepIDs,
    ...data
  }: EntityCreateParams<DiagramEntity>) {
    super(data);

    ({
      name: this.name,
      type: this.type,
      zoom: this.zoom,
      nodes: this.nodes,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      modified: this.modified,
      children: this.children,
      diagramID: this.diagramID,
      versionID: this.versionID,
      creatorID: this.creatorID,
      variables: this.variables,
      menuItems: this.menuItems,
      menuNodeIDs: this.menuNodeIDs,
      intentStepIDs: this.intentStepIDs,
    } = DiagramEntity.fromJSON({
      name,
      type,
      zoom,
      nodes,
      offsetX,
      offsetY,
      modified,
      children,
      diagramID,
      versionID,
      creatorID,
      variables,
      menuItems,
      menuNodeIDs,
      intentStepIDs,
    }));

    cleanupUndefinedFields(this);
  }

  toJSON(): ToJSON<DiagramEntity> {
    return DiagramJSONAdapter.fromDB(this);
  }
}
