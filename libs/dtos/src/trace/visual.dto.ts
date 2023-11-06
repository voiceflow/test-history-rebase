import { z } from 'zod';

import { TraceDTOFactory, TraceType } from './utils.dto';

export enum VisualType {
  APL = 'apl',
  IMAGE = 'image',
}

export enum CanvasVisibility {
  FULL = 'full',
  HIDDEN = 'hidden',
  CROPPED = 'cropped',
}

export const DimensionsDTO = z.object({
  width: z.number(),
  height: z.number(),
});

export const ImageDTO = z.object({
  visualType: z.literal(VisualType.IMAGE),

  image: z.string().nullable(),
  device: z.string().nullable().optional(),
  frameType: z.string().optional(),
  dimensions: DimensionsDTO.nullable().optional(),
  canvasVisibility: z.nativeEnum(CanvasVisibility).optional(),
  options: z
    .object({
      loop: z.boolean().optional(),
    })
    .optional(),
});

export const VisualTraceDTO = TraceDTOFactory(TraceType.VISUAL, {
  payload: ImageDTO, // APL is deprecated
});

export type VisualTrace = z.infer<typeof VisualTraceDTO>;
