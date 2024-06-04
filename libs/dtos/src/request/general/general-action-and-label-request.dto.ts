import { z } from 'zod';

import { ActionAndLabelRequestPayloadDTO } from '../payload.dto';
import { BaseRequestDTO } from '../utils.dto';

export const GeneralActionAndLabelRequestDTO = BaseRequestDTO.extend({
  payload: ActionAndLabelRequestPayloadDTO.passthrough()
});

export type GeneralActionAndLabelRequest = z.infer<typeof GeneralActionAndLabelRequestDTO>;

export const isGeneralActionAndLabelRequest = (value: unknown): value is GeneralActionAndLabelRequest => (
  GeneralActionAndLabelRequestDTO.safeParse(value).success
);
