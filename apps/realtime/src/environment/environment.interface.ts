import {
  AnyAttachmentEntity,
  AnyResponseAttachmentEntity,
  AnyResponseVariantEntity,
  CardButtonEntity,
  EntityEntity,
  EntityVariantEntity,
  FolderEntity,
  FunctionEntity,
  FunctionPathEntity,
  FunctionVariableEntity,
  IntentEntity,
  RequiredEntityEntity,
  ResponseDiscriminatorEntity,
  ResponseEntity,
  UtteranceEntity,
  VariableEntity,
} from '@voiceflow/orm-designer';

export interface EnvironmentCMSEntities {
  folders: FolderEntity[];
  intents: IntentEntity[];
  entities: EntityEntity[];
  variables: VariableEntity[];
  functions: FunctionEntity[];
  responses: ResponseEntity[];
  utterances: UtteranceEntity[];
  attachments: AnyAttachmentEntity[];
  cardButtons: CardButtonEntity[];
  functionPaths: FunctionPathEntity[];
  entityVariants: EntityVariantEntity[];
  requiredEntities: RequiredEntityEntity[];
  responseVariants: AnyResponseVariantEntity[];
  functionVariables: FunctionVariableEntity[];
  responseAttachments: AnyResponseAttachmentEntity[];
  responseDiscriminators: ResponseDiscriminatorEntity[];
}
