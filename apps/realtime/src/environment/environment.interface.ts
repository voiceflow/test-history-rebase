import { AnyResponseVariant, Entity, EntityVariant, Intent, RequiredEntity, Response,ResponseDiscriminator, Utterance } from '@voiceflow/dtos';
import {
  AnyResponseAttachmentObject,
  AnyResponseVariantObject,
  CardButtonObject,
  EntityObject,
  EntityVariantObject,
  FlowObject,
  FolderObject,
  FunctionObject,
  FunctionPathObject,
  FunctionVariableObject,
  IntentObject,
  RequiredEntityObject,
  ResponseDiscriminatorObject,
  ResponseObject,
  UtteranceObject,
  VariableObject,
  WorkflowObject,
} from '@voiceflow/orm-designer';

import { AnyAttachmentObjectWithType } from '@/attachment/attachment.interface';

export interface EnvironmentCMSData {
  flows: FlowObject[];
  folders: FolderObject[];
  intents: IntentObject[];
  entities: EntityObject[];
  variables: VariableObject[];
  functions: FunctionObject[];
  responses: ResponseObject[];
  workflows: WorkflowObject[];
  utterances: UtteranceObject[];
  attachments: AnyAttachmentObjectWithType[];
  cardButtons: CardButtonObject[];
  functionPaths: FunctionPathObject[];
  entityVariants: EntityVariantObject[];
  requiredEntities: RequiredEntityObject[];
  responseVariants: AnyResponseVariantObject[];
  functionVariables: FunctionVariableObject[];
  responseAttachments: AnyResponseAttachmentObject[];
  responseDiscriminators: ResponseDiscriminatorObject[];
}

export interface CMSResources {
  intents: IntentObject[];
  entities: EntityObject[];
  responses: ResponseObject[];
  variables: VariableObject[];
  utterances: UtteranceObject[];
  entityVariants: EntityVariantObject[];
  isVoiceAssistant: boolean;
  requiredEntities: RequiredEntityObject[];
  responseVariants: AnyResponseVariantObject[];
  responseDiscriminators: ResponseDiscriminatorObject[];
}

export interface IntentsAndEntitiesData {
  intents: Intent[];
  entities: Entity[];
  responses: Response[];
  utterances: Utterance[];
  entityVariants: EntityVariant[];
  requiredEntities: RequiredEntity[];
  responseVariants: AnyResponseVariant[];
  responseDiscriminators: ResponseDiscriminator[];
}

export interface MigrationDataMeta {
  userID: number;
  assistantID: string;
  environmentID: string;
}
