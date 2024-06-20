import { z } from 'zod';

import { NodeType } from '@/node/node-type.enum';

export const ReferenceResourceBaseNodeMetadataDTO = z.object({
  nodeType: z.nativeEnum(NodeType),
});

export type ReferenceResourceBaseNodeMetadata = z.infer<typeof ReferenceResourceBaseNodeMetadataDTO>;

export type InferReferenceResourceBaseNodeMetadata<
  N extends z.ZodType<any> & { ['_output']: ReferenceResourceBaseNodeMetadata },
> = z.infer<N>;

export const ReferenceResourceIntentNodeMetadataDTO = ReferenceResourceBaseNodeMetadataDTO.extend({
  nodeType: z.literal(NodeType.INTENT),
});

export type ReferenceResourceIntentNodeMetadata = InferReferenceResourceBaseNodeMetadata<
  typeof ReferenceResourceIntentNodeMetadataDTO
>;

export const ReferenceResourceTriggerNodeMetadataDTO = ReferenceResourceBaseNodeMetadataDTO.extend({
  nodeType: z.literal(NodeType.TRIGGER),
});

export type ReferenceResourceTriggerNodeMetadata = InferReferenceResourceBaseNodeMetadata<
  typeof ReferenceResourceTriggerNodeMetadataDTO
>;

export const ReferenceResourceBlockNodeMetadataDTO = ReferenceResourceBaseNodeMetadataDTO.extend({
  nodeType: z.literal(NodeType.BLOCK),
  name: z.string(),
});

export type ReferenceResourceBlockNodeMetadata = InferReferenceResourceBaseNodeMetadata<
  typeof ReferenceResourceBlockNodeMetadataDTO
>;

export const ReferenceResourceStartNodeMetadataDTO = ReferenceResourceBaseNodeMetadataDTO.extend({
  nodeType: z.literal(NodeType.START),
  name: z.string(),
});

export type ReferenceResourceStartNodeMetadata = InferReferenceResourceBaseNodeMetadata<
  typeof ReferenceResourceStartNodeMetadataDTO
>;

export const ReferenceResourceComponentNodeMetadataDTO = ReferenceResourceBaseNodeMetadataDTO.extend({
  nodeType: z.literal(NodeType.COMPONENT),
});

export type ReferenceResourceComponentNodeMetadata = InferReferenceResourceBaseNodeMetadata<
  typeof ReferenceResourceComponentNodeMetadataDTO
>;

export const ReferenceResourceFunctionNodeMetadataDTO = ReferenceResourceBaseNodeMetadataDTO.extend({
  nodeType: z.literal(NodeType.FUNCTION),
});

export type ReferenceResourceFunctionNodeMetadata = InferReferenceResourceBaseNodeMetadata<
  typeof ReferenceResourceFunctionNodeMetadataDTO
>;

export const ReferenceResourceInteractionNodeMetadataDTO = ReferenceResourceBaseNodeMetadataDTO.extend({
  nodeType: z.literal(NodeType.INTERACTION),
});

export type ReferenceResourceInteractionNodeMetadata = InferReferenceResourceBaseNodeMetadata<
  typeof ReferenceResourceInteractionNodeMetadataDTO
>;

export const ReferenceResourceButtonsNodeMetadataDTO = ReferenceResourceBaseNodeMetadataDTO.extend({
  nodeType: z.literal(NodeType.BUTTONS),
});

export type ReferenceResourceButtonsNodeMetadata = InferReferenceResourceBaseNodeMetadata<
  typeof ReferenceResourceButtonsNodeMetadataDTO
>;

export const ReferenceResourceChoiceV2NodeMetadataDTO = ReferenceResourceBaseNodeMetadataDTO.extend({
  nodeType: z.literal(NodeType.CHOICE_V2),
});

export type ReferenceResourceChoiceV2NodeMetadata = InferReferenceResourceBaseNodeMetadata<
  typeof ReferenceResourceChoiceV2NodeMetadataDTO
>;

export const ReferenceResourceNodeMetadataDTO = z.discriminatedUnion('nodeType', [
  ReferenceResourceBlockNodeMetadataDTO,
  ReferenceResourceStartNodeMetadataDTO,
  ReferenceResourceIntentNodeMetadataDTO,
  ReferenceResourceTriggerNodeMetadataDTO,
  ReferenceResourceButtonsNodeMetadataDTO,
  ReferenceResourceFunctionNodeMetadataDTO,
  ReferenceResourceChoiceV2NodeMetadataDTO,
  ReferenceResourceComponentNodeMetadataDTO,
  ReferenceResourceInteractionNodeMetadataDTO,
]);

export type ReferenceResourceNodeMetadata = z.infer<typeof ReferenceResourceNodeMetadataDTO>;

// TODO: replace with union when new reference resource types are added
export const ReferenceResourceMetadataDTO = ReferenceResourceNodeMetadataDTO;

export type ReferenceResourceMetadata = z.infer<typeof ReferenceResourceMetadataDTO>;
