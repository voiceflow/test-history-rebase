import { ObjectId } from '@mikro-orm/mongodb';
import { Reference, ReferenceResource } from '@voiceflow/dtos';
import _ from 'lodash';

export abstract class ReferenceBaseBuilderUtil {
  protected readonly assistantID: string;

  protected readonly environmentID: string;

  protected references: Reference[] = [];

  protected referenceResources: ReferenceResource[] = [];

  constructor({ assistantID, environmentID }: { assistantID: string; environmentID: string }) {
    this.assistantID = assistantID;
    this.environmentID = environmentID;
  }

  public abstract build(): Promise<{ references: Reference[]; referenceResources: ReferenceResource[] }>;

  protected genID() {
    return new ObjectId().toJSON();
  }

  protected chunk<T>(array: T[], size = 10) {
    return _.chunk(array, size);
  }

  protected buildReference({ id = this.genID(), ...data }: Omit<Reference, 'id' | 'environmentID'> & { id?: string }) {
    const resource: Reference = { ...data, id, environmentID: this.environmentID };

    this.references.push(resource);

    return resource;
  }

  protected buildReferenceResource({
    id = this.genID(),
    ...data
  }: Omit<ReferenceResource, 'id' | 'assistantID' | 'environmentID'> & { id?: string }) {
    const referenceResource: ReferenceResource = {
      ...data,
      id,
      assistantID: this.assistantID,
      environmentID: this.environmentID,
    };

    this.referenceResources.push(referenceResource);

    return referenceResource;
  }
}
