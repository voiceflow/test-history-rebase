import { z } from 'zod';

import { ActionAndLabelRequestPayloadDTO } from '../payload.dto';
import { GeneralActionAndLabelRequestDTO } from './general-request.dto';

export const PathRequestDTO = GeneralActionAndLabelRequestDTO.extend({
  type: z.string().refine((val) => val.startsWith('path-')),
  payload: ActionAndLabelRequestPayloadDTO.passthrough().required({ label: true }),
}).passthrough();

export type PathRequest = z.infer<typeof PathRequestDTO>;

export const isPathRequest = (request: unknown): request is PathRequest => PathRequestDTO.safeParse(request).success;
