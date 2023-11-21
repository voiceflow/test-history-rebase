import {
  AnyResponseAttachmentDTO,
  AnyResponseVariantDTO,
  DiagramDTO,
  EntityDTO,
  EntityVariantDTO,
  FunctionDTO,
  FunctionPathDTO,
  FunctionVariableDTO,
  IntentDTO,
  ProjectDTO,
  RequiredEntityDTO,
  ResponseDiscriminatorDTO,
  ResponseDTO,
  UtteranceDTO,
  VersionDTO,
} from '@voiceflow/dtos';
import { z } from 'zod';

export const EnvironmentPreparePrototypeResponse = z
  .object({
    version: VersionDTO,
    project: ProjectDTO,
    intents: z.array(IntentDTO),
    entities: z.array(EntityDTO),
    diagrams: z.array(DiagramDTO),
    responses: z.array(ResponseDTO),
    functions: z.array(FunctionDTO),
    utterances: z.array(UtteranceDTO),
    functionPaths: z.array(FunctionPathDTO),
    liveDiagramIDs: z.array(z.string()),
    entityVariants: z.array(EntityVariantDTO),
    responseVariants: z.array(AnyResponseVariantDTO),
    requiredEntities: z.array(RequiredEntityDTO),
    functionVariables: z.array(FunctionVariableDTO),
    responseAttachments: z.array(AnyResponseAttachmentDTO),
    responseDiscriminators: z.array(ResponseDiscriminatorDTO),
  })
  .strict();

export type EnvironmentPreparePrototypeResponse = z.infer<typeof EnvironmentPreparePrototypeResponse>;
