import { z } from 'zod';

import { ActionAndLabelRequestPayloadDTO } from './payload.dto';
import { RequestType } from './request-type.enum';
import { BaseRequestDTO } from './utils.dto';

export const GeneralRequestDTO = BaseRequestDTO.extend({
  type: z.string().refine((val) => !Object.values<string>(RequestType).includes(val)),
  payload: ActionAndLabelRequestPayloadDTO.optional(),
});

export type GeneralRequest = z.infer<typeof GeneralRequestDTO>;

export const isGeneralRequest = (value: unknown): value is GeneralRequest => GeneralRequestDTO.safeParse(value).success;
