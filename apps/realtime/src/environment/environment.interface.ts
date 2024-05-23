import {
  AnyResponseVariant,
  Entity,
  EntityVariant,
  Intent,
  RequiredEntity,
  Response,
  ResponseDiscriminator,
  Utterance,
} from '@voiceflow/dtos';
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
  flows: CMSFlow[];
  folders: CMSFolder[];
  intents: CMSIntent[];
  entities: CMSEntity[];
  variables: CMSVariable[];
  functions: CMSFunction[];
  responses: CMSResponse[];
  workflows: CMSWorkflow[];
  utterances: CMSUtterance[];
  attachments: CMSAttachment[];
  cardButtons: CMSCardButton[];
  functionPaths: CMSFunctionPath[];
  entityVariants: CMSEntityVariant[];
  requiredEntities: CMSRequiredEntity[];
  responseVariants: CMSResponseVariant[];
  functionVariables: CMSFunctionVariable[];
  responseAttachments: CMSResponseAttachment[];
  responseDiscriminators: CMSResponseDiscriminator[];
}

export type CMSFlow = FlowObject;
export type CMSFolder = FolderObject;
export type CMSIntent = IntentObject;
export type CMSEntity = EntityObject;
export type CMSVariable = VariableObject;
export type CMSFunction = FunctionObject;
export type CMSResponse = ResponseObject;
export type CMSWorkflow = WorkflowObject;
export type CMSUtterance = UtteranceObject;
export type CMSAttachment = AnyAttachmentObjectWithType;
export type CMSCardButton = CardButtonObject;
export type CMSFunctionPath = FunctionPathObject;
export type CMSEntityVariant = EntityVariantObject;
export type CMSRequiredEntity = RequiredEntityObject;
export type CMSResponseVariant = AnyResponseVariantObject;
export type CMSFunctionVariable = FunctionVariableObject;
export type CMSResponseAttachment = AnyResponseAttachmentObject;
export type CMSResponseDiscriminator = ResponseDiscriminatorObject;

export interface CMSResources {
  intents: CMSIntent[];
  entities: CMSEntity[];
  responses: CMSResponse[];
  variables: CMSVariable[];
  utterances: CMSUtterance[];
  entityVariants: CMSEntityVariant[];
  isVoiceAssistant: boolean;
  requiredEntities: CMSRequiredEntity[];
  responseVariants: CMSResponseVariant[];
  responseDiscriminators: CMSResponseDiscriminator[];
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
