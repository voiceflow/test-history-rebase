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

export const ReferenceResourceNodeMetadataDTO = z.discriminatedUnion('nodeType', [
  ReferenceResourceBlockNodeMetadataDTO,
  ReferenceResourceStartNodeMetadataDTO,
  ReferenceResourceIntentNodeMetadataDTO,
  ReferenceResourceTriggerNodeMetadataDTO,
]);

export type ReferenceResourceNodeMetadata = z.infer<typeof ReferenceResourceNodeMetadataDTO>;

// TODO: replace with union when new reference resource types are added
export const ReferenceResourceMetadataDTO = ReferenceResourceNodeMetadataDTO;

export type ReferenceResourceMetadata = z.infer<typeof ReferenceResourceMetadataDTO>;
