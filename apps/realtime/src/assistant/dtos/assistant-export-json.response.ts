import {
  AnyResponseAttachmentDTO,
  AnyResponseVariantDTO,
  DiagramDTO,
  EntityDTO,
  EntityVariantDTO,
  IntentDTO,
  ProgramDTO,
  ProjectDTO,
  PrototypeProgramDTO,
  RequiredEntityDTO,
  ResponseDiscriminatorDTO,
  ResponseDTO,
  UtteranceDTO,
  VariableStateDTO,
  VersionDTO,
} from '@voiceflow/dtos';
import { z } from 'zod';

import { FunctionExportJSONResponse } from '@/function/dtos/function-export-json.response';

export const AssistantExportJSONResponse = z
  .object({
    project: ProjectDTO,
    version: VersionDTO,
    diagrams: z.record(DiagramDTO),
    _version: z.string(),
    programs: z.record(ProgramDTO).optional(),
    variableStates: z.array(VariableStateDTO).optional(),
    prototypePrograms: z.record(PrototypeProgramDTO).optional(),

    // response
    responses: ResponseDTO.array().optional(),
    responseVariants: AnyResponseVariantDTO.array().optional(),
    responseAttachments: AnyResponseAttachmentDTO.array().optional(),
    responseDiscriminators: ResponseDiscriminatorDTO.array().optional(),

    // entities
    entities: EntityDTO.array().optional(),
    entityVariants: EntityVariantDTO.array().optional(),

    // intents
    intents: IntentDTO.array().optional(),
    utterances: UtteranceDTO.array().optional(),
    requiredEntities: RequiredEntityDTO.array().optional(),
  })
  .merge(FunctionExportJSONResponse.partial());

export type AssistantExportJSONResponse = z.infer<typeof AssistantExportJSONResponse>;
