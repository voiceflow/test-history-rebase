import { z } from 'zod';

import { CanvasVisibility } from '@/node/visual/canvas-visibility-enum';
import { VisualType } from '@/node/visual/visual-type.enum';

import { TraceType } from './trace-type.enum';
import { BaseTraceDTO } from './utils.dto';

export const VisualTraceImageDTO = z.object({
  visualType: z.literal(VisualType.IMAGE),

  image: z.string().nullable(),
  device: z.string().nullable().optional(),
  options: z.object({ loop: z.boolean().optional() }).optional(),
  frameType: z.string().optional(),
  dimensions: z.object({ width: z.number(), height: z.number() }).nullable().optional(),
  canvasVisibility: z.nativeEnum(CanvasVisibility).optional(),
});

export const VisualTraceDTO = BaseTraceDTO.extend({
  type: z.literal(TraceType.VISUAL),

  /**
   * APL is deprecated, so we only support Image for now.
   */
  payload: VisualTraceImageDTO,
});

export type VisualTrace = z.infer<typeof VisualTraceDTO>;
