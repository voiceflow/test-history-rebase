import {
  AnyAttachmentEntity,
  AnyResponseAttachmentEntity,
  AnyResponseVariantEntity,
  AnyTriggerEntity,
  CardButtonEntity,
  EntityEntity,
  EntityVariantEntity,
  FunctionEntity,
  FunctionPathEntity,
  FunctionVariableEntity,
  IntentEntity,
  PromptEntity,
  RequiredEntityEntity,
  ResponseDiscriminatorEntity,
  ResponseEntity,
  StoryEntity,
  UtteranceEntity,
  VariableEntity,
} from '@voiceflow/orm-designer';

export interface EnvironmentCMSEntities {
  stories: StoryEntity[];
  intents: IntentEntity[];
  prompts: PromptEntity[];
  entities: EntityEntity[];
  triggers: AnyTriggerEntity[];
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
