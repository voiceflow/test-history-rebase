import { Entity, ManyToOne, OneToOne, Property, Unique, wrap } from '@mikro-orm/core';

import type { EntityCreateParams, Ref, ToJSONWithForeignKeys } from '@/types';

import { PostgresCMSObjectEntity } from '../common/entities/postgres-cms-object.entity';
import { PersonaEntity } from '../persona/persona.entity';
import { WorkspaceStubEntity } from '../stubs/workspace.stub';
import { AssistantJSONAdapter } from './assistant.adapter';

@Entity({ tableName: 'designer.assistant' })
@Unique({ properties: ['id'] })
export class AssistantEntity extends PostgresCMSObjectEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<AssistantEntity>>>(data: JSON) {
    return AssistantJSONAdapter.toDB<JSON>(data);
  }

  @Property()
  name: string;

  @ManyToOne(() => WorkspaceStubEntity, { name: 'workspace_id', onDelete: 'cascade' })
  workspace: Ref<WorkspaceStubEntity>;

  @OneToOne(() => PersonaEntity, {
    name: 'active_persona_id',
    owner: true,
    default: null,
    nullable: true,
    onDelete: 'set default',
    fieldNames: ['active_persona_id', 'active_environment_id'],
  })
  activePersona: Ref<PersonaEntity> | null = null;

  @Property({ name: 'active_environment_id', type: 'varchar', length: 24 })
  activeEnvironmentID: string;

  constructor(data: EntityCreateParams<AssistantEntity>) {
    super(data);

    ({
      name: this.name,
      workspace: this.workspace,
      activePersona: this.activePersona,
      activeEnvironmentID: this.activeEnvironmentID,
    } = AssistantEntity.fromJSON(data));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<AssistantEntity> {
    return AssistantJSONAdapter.fromDB({
      ...wrap<AssistantEntity>(this).toObject(...args),
      updatedBy: this.updatedBy,
      workspace: this.workspace,
      activePersona: this.activePersona ?? null,
    });
  }
}
