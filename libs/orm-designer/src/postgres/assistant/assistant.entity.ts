import { Entity, ManyToOne, OneToOne, Property, ref, Unique } from '@mikro-orm/core';

import type { EntityCreateParams, Ref, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

import { PostgresCMSObjectEntity } from '../common/entities/postgres-cms-object.entity';
import { PersonaEntity } from '../persona/persona.entity';
import { WorkspaceStubEntity } from '../stubs/workspace.stub';

@Entity({ tableName: 'designer.assistant' })
@Unique({ properties: ['id'] })
export class AssistantEntity extends PostgresCMSObjectEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<AssistantEntity>>({
    workspaceID,
    activePersonaID,
    activeEnvironmentID,
    ...data
  }: Data) {
    return {
      ...data,
      ...(workspaceID !== undefined && { workspace: ref(WorkspaceStubEntity, workspaceID) }),
      ...(activeEnvironmentID !== undefined && {
        activeEnvironmentID,
        ...(activePersonaID !== undefined && {
          activePersona: activePersonaID
            ? ref(PersonaEntity, { id: activePersonaID, environmentID: activeEnvironmentID })
            : null,
        }),
      }),
    } as ResolvedForeignKeys<AssistantEntity, Data>;
  }

  @Property()
  name: string;

  @ManyToOne(() => WorkspaceStubEntity, { name: 'workspace_id', onDelete: 'cascade' })
  workspace: Ref<WorkspaceStubEntity>;

  @OneToOne(() => PersonaEntity, {
    name: 'active_persona_id',
    owner: true,
    default: null,
    onDelete: 'set default',
    fieldNames: ['active_persona_id', 'active_environment_id'],
  })
  activePersona: Ref<PersonaEntity> | null;

  @Property({ name: 'active_environment_id' })
  activeEnvironmentID: string;

  constructor(data: EntityCreateParams<AssistantEntity>) {
    super(data);

    ({
      name: this.name,
      workspace: this.workspace,
      activePersona: this.activePersona,
      activeEnvironmentID: this.activeEnvironmentID,
    } = AssistantEntity.resolveForeignKeys(data));
  }

  toJSON(...args: any[]) {
    return {
      ...super.toJSON(...args),
      workspaceID: this.workspace.id,
      activePersonaID: this.activePersona?.id ?? null,
    };
  }
}
