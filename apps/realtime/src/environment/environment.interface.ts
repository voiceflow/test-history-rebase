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
