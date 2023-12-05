import {
  AnyAttachmentDTO,
  AnyResponseAttachmentDTO,
  AnyResponseVariantDTO,
  CardButtonDTO,
  DiagramDTO,
  EntityDTO,
  EntityVariantDTO,
  IntentDTO,
  ProjectDTO,
  RequiredEntityDTO,
  ResponseDiscriminatorDTO,
  ResponseDTO,
  UtteranceDTO,
  VariableStateDTO,
  VersionDTO,
} from '@voiceflow/dtos';
import { z } from 'zod';

import { FunctionImportJSONDataDTO } from '@/function/dtos/function-import-json-data.dto';
import { zodDeepStrip } from '@/utils/zod-deep-strip.util';

export const AssistantImportJSONDataDTO = z
  .object({
    project: zodDeepStrip(ProjectDTO),
    version: zodDeepStrip(VersionDTO),
    diagrams: z.record(zodDeepStrip(DiagramDTO.extend({ diagramID: z.string().optional() }))),
    _version: z.string().optional(),
    variableStates: z.array(zodDeepStrip(VariableStateDTO)).optional(),

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

    // attachments
    attachments: AnyAttachmentDTO.array().optional(),
    cardButtons: CardButtonDTO.array().optional(),
  })
  .merge(FunctionImportJSONDataDTO.partial());

export type AssistantImportJSONDataDTO = z.infer<typeof AssistantImportJSONDataDTO>;
