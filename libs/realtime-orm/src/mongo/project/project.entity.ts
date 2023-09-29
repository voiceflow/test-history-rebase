import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ collection: 'project' })
export class ProjectEntity {
  @Property()
  assistantID: string;

  @PrimaryKey()
  _id!: number;

  constructor({ assistantID }: Pick<ProjectEntity, 'assistantID'>) {
    this.assistantID = assistantID;
  }
}
