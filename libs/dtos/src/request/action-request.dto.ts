import { z } from 'zod';

import { ActionAndLabelRequestPayloadDTO } from './payload.dto';
import { RequestType } from './request-type.enum';
import { BaseRequestDTO } from './utils.dto';

export const ActionRequestDTO = BaseRequestDTO.extend({
  type: z.literal(RequestType.ACTION),
  payload: ActionAndLabelRequestPayloadDTO.optional(),
});

export type ActionRequest = z.infer<typeof ActionRequestDTO>;

export const isActionRequest = (value: unknown): value is ActionRequest => ActionRequestDTO.safeParse(value).success;
