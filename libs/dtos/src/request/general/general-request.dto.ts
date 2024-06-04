import { z } from 'zod';

import { ActionAndLabelRequestPayloadDTO } from '../payload.dto';
import { RequestType } from '../request-type.enum';
import { BaseRequestDTO } from '../utils.dto';

export const GeneralUnknownRequestDTO = BaseRequestDTO.extend({
  type: z.string().refine((val) => !Object.values<string>(RequestType).includes(val)),
  payload: z.unknown().optional(),
}).passthrough();

export type GeneralUnknownRequest = z.infer<typeof GeneralUnknownRequestDTO>;

export const GeneralActionAndLabelRequestDTO = BaseRequestDTO.extend({
  payload: ActionAndLabelRequestPayloadDTO.passthrough().optional()
});

export type GeneralActionAndLabelRequest = z.infer<typeof GeneralActionAndLabelRequestDTO>;

export const GeneralRequestDTO = z.union([
  GeneralUnknownRequestDTO,
  GeneralActionAndLabelRequestDTO
]);

export type GeneralRequest = z.infer<typeof GeneralRequestDTO>;

export const isGeneralRequest = (value: unknown): value is GeneralRequest => GeneralRequestDTO.safeParse(value).success;

export const isGeneralActionAndLabelRequest = (value: unknown): value is GeneralActionAndLabelRequest => (
  GeneralActionAndLabelRequestDTO.safeParse(value).success
);
