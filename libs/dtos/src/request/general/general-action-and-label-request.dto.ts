import { z } from 'zod';

import { ActionAndLabelRequestPayloadDTO } from '../payload.dto';
import { GeneralUnknownRequestDTO } from './general-unknown-request.dto';

export const GeneralActionAndLabelRequestDTO = GeneralUnknownRequestDTO.extend({
  payload: ActionAndLabelRequestPayloadDTO.passthrough()
});

export type GeneralActionAndLabelRequest = z.infer<typeof GeneralActionAndLabelRequestDTO>;

export const isGeneralActionAndLabelRequest = (value: unknown): value is GeneralActionAndLabelRequest => (
  GeneralActionAndLabelRequestDTO.safeParse(value).success
);
