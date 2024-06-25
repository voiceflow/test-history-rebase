import type { ReferenceResourceType } from '@voiceflow/dtos';

import { PostgresObjectIDMutableORM } from '@/postgres/common/orms/postgres-object-id-mutable.orm';

import { ReferenceResourceEntity } from './reference-resource.entity';
import { ReferenceResourceJSONAdapter } from './reference-resource-json.adapter';

export class ReferenceResourceORM extends PostgresObjectIDMutableORM<ReferenceResourceEntity> {
  Entity = ReferenceResourceEntity;

  jsonAdapter = ReferenceResourceJSONAdapter;

  findManyByEnvironment(environmentID: string) {
    return this.find({ environmentID });
  }

  deleteManyByEnvironment(environmentID: string) {
    return this.delete({ environmentID });
  }

  async findOneByTypeDiagramIDAndResourceID(data: {
    type: ReferenceResourceType;
    diagramID: string | null;
    resourceID: string;
    environmentID: string;
  }) {
    const [resource = null] = await this.find(data, { limit: 1 });

    return resource;
  }

  async deleteManyByTypeAndDiagramIDs({
    type,
    diagramIDs,
    environmentID,
  }: {
    type: ReferenceResourceType;
    diagramIDs: string[];
    environmentID: string;
  }) {
    return this.delete({ type, diagramID: diagramIDs, environmentID }, true);
  }

  async deleteManyByTypeDiagramIDAndResourceIDs({
    type,
    diagramID,
    resourceIDs,
    environmentID,
  }: {
    type: ReferenceResourceType;
    diagramID: string | null;
    resourceIDs: string[];
    environmentID: string;
  }) {
    return this.delete({ type, diagramID, resourceID: resourceIDs, environmentID }, true);
  }
}
