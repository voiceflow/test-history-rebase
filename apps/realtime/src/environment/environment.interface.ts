import type {
  AnyResponseVariant,
  Entity,
  EntityVariant,
  Intent,
  RequiredEntity,
  Response,
  ResponseDiscriminator,
  ResponseMessage,
  Utterance,
} from '@voiceflow/dtos';
import type {
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
  ResponseMessageObject,
  ResponseObject,
  UtteranceObject,
  VariableObject,
  WorkflowObject,
} from '@voiceflow/orm-designer';

import type { AnyAttachmentObjectWithType } from '@/attachment/attachment.interface';

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
  responseMessages: ResponseMessageObject[];
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
  responseMessages: ResponseMessageObject[];
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
  responseMessages: ResponseMessage[];
  responseDiscriminators: ResponseDiscriminator[];
}

export interface MigrationDataMeta {
  userID: number;
  assistantID: string;
  environmentID: string;
}
