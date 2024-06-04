import { z } from 'zod';

import { GeneralActionAndLabelRequestDTO } from './general-action-and-label-request.dto';
import { GeneralUnknownRequestDTO } from './general-unknown-request.dto';

export const GeneralRequestDTO = z.union([
  GeneralUnknownRequestDTO,
  GeneralActionAndLabelRequestDTO
]);

export type GeneralRequest = z.infer<typeof GeneralRequestDTO>;

export const isGeneralRequest = (value: unknown): value is GeneralRequest => GeneralRequestDTO.safeParse(value).success;

