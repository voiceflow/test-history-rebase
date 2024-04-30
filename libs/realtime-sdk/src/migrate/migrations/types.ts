import type { BaseModels, BaseVersion } from '@voiceflow/base-types';
import type {
  AnyResponseVariant,
  Assistant,
  Entity,
  EntityVariant,
  Flow,
  Folder,
  Intent,
  RequiredEntity,
  Response,
  ResponseDiscriminator,
  Utterance,
  Variable,
  Workflow,
} from '@voiceflow/dtos';
import type { Draft } from 'immer';

import type { AnyProject } from '@/models';
import type { SchemaVersion } from '@/schema-version/schema-version.enum';

export type VersionUpdateData = Pick<
  BaseVersion.Version<any>,
  | '_version'
  | 'name'
  | 'notes'
  | 'variables'
  | 'rootDiagramID'
  | 'platformData'
  | 'topics'
  | 'folders'
  | 'components'
  | 'canvasTemplates'
  | 'defaultStepColors'
  | 'templateDiagramID'
  | 'domains'
>;

export type DiagramUpdateData = Omit<BaseModels.Diagram.Model, '_id' | 'creatorID' | 'versionID'> & {
  readonly _id: string;
  readonly diagramID: string;
};

export interface MigrationData {
  version: VersionUpdateData;
  diagrams: DiagramUpdateData[];

  cms: {
    flows: Flow[];
    folders: Folder[];
    intents: Intent[];
    entities: Entity[];
    variables: Variable[];
    assistant: Assistant | null;
    responses: Response[];
    workflows: Workflow[];
    utterances: Utterance[];
    entityVariants: EntityVariant[];
    requiredEntities: RequiredEntity[];
    responseVariants: AnyResponseVariant[];
    responseDiscriminators: ResponseDiscriminator[];
  };

  // TODO: add cmsDelete if we need to delete any cms resources
}

export interface MigrationContext {
  project: AnyProject;
  creatorID: number;
}

export type Transform = (data: Draft<MigrationData>, context: MigrationContext) => void;

export interface Migration {
  version: SchemaVersion;
  transform: Transform;
}
