import {
  AnyResponseVariant,
  Entity,
  EntityVariant,
  Intent,
  RequiredEntity,
  Response,
  ResponseDiscriminator,
  Utterance,
  Version,
  VersionProgramResources,
} from '@voiceflow/dtos';
import {
  AnyAttachmentJSON,
  AnyResponseAttachmentJSON,
  AnyResponseAttachmentObject,
  AnyResponseVariantJSON,
  AnyResponseVariantObject,
  CardButtonJSON,
  CardButtonObject,
  DiagramJSON,
  DiagramObject,
  EntityJSON,
  EntityObject,
  EntityVariantJSON,
  EntityVariantObject,
  FlowJSON,
  FlowObject,
  FolderJSON,
  FolderObject,
  FunctionJSON,
  FunctionObject,
  FunctionPathJSON,
  FunctionPathObject,
  FunctionVariableJSON,
  FunctionVariableObject,
  IntentJSON,
  IntentObject,
  ProjectObject,
  RequiredEntityJSON,
  RequiredEntityObject,
  ResponseDiscriminatorJSON,
  ResponseDiscriminatorObject,
  ResponseJSON,
  ResponseObject,
  UtteranceJSON,
  UtteranceObject,
  VariableJSON,
  VariableObject,
  VersionObject,
  WorkflowJSON,
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

export interface PrototypeData extends EnvironmentCMSData {
  version: VersionObject;
  diagrams: DiagramObject[];
  programResources: VersionProgramResources;
  project: ProjectObject;
  liveDiagramIDs: string[];
}

export interface EnvironmentCMSJsonData {
  flows: FlowJSON[];
  folders: FolderJSON[];
  intents: IntentJSON[];
  entities: EntityJSON[];
  variables: VariableJSON[];
  functions: FunctionJSON[];
  responses: ResponseJSON[];
  workflows: WorkflowJSON[];
  utterances: UtteranceJSON[];
  attachments: AnyAttachmentJSON[];
  cardButtons: CardButtonJSON[];
  functionPaths: FunctionPathJSON[];
  entityVariants: EntityVariantJSON[];
  requiredEntities: RequiredEntityJSON[];
  responseVariants: AnyResponseVariantJSON[];
  functionVariables: FunctionVariableJSON[];
  responseAttachments: AnyResponseAttachmentJSON[];
  responseDiscriminators: ResponseDiscriminatorJSON[];
}

export interface EnvironmentJSONWithSubResources extends EnvironmentCMSJsonData {
  version: Version;
  diagrams: DiagramJSON[];
}
