import { Entity, ManyToOne, OneToOne, Property, Unique } from '@mikro-orm/core';

import type { Ref } from '@/types';

import { PostgresCMSObjectEntity } from '../common/entities/postgres-cms-object.entity';
import { PersonaEntity } from '../persona/persona.entity';
import { WorkspaceStubEntity } from '../stubs/workspace.stub';

@Entity({ tableName: 'designer.assistant' })
@Unique({ properties: ['id'] })
export class AssistantEntity extends PostgresCMSObjectEntity<'activePersona'> {
  @Property()
  name!: string;

  @ManyToOne(() => WorkspaceStubEntity, { name: 'workspace_id', onDelete: 'cascade' })
  workspace!: Ref<WorkspaceStubEntity>;

  @OneToOne(() => PersonaEntity, {
    name: 'active_persona_id',
    owner: true,
    default: null,
    nullable: true,
    onDelete: 'set default',
    fieldNames: ['active_environment_id', 'active_persona_id'],
  })
  activePersona!: Ref<PersonaEntity> | null;

  @Property({ name: 'active_environment_id', type: 'varchar', length: 24 })
  activeEnvironmentID!: string;
}
