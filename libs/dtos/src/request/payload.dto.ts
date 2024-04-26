import { z } from 'zod';

import { BaseActionDTO } from '@/action/action.dto';

export const ActionRequestPayloadDTO = z.object({
  actions: z.array(BaseActionDTO).optional(),
});

export type ActionRequestPayload = z.infer<typeof ActionRequestPayloadDTO>;

export const LabelRequestPayloadDTO = z.object({
  label: z.string().optional(),
});

export type LabelRequestPayload = z.infer<typeof LabelRequestPayloadDTO>;

export const ActionAndLabelRequestPayloadDTO = ActionRequestPayloadDTO.merge(LabelRequestPayloadDTO);

export type ActionAndLabelRequestPayloadDTO = z.infer<typeof ActionAndLabelRequestPayloadDTO>;
