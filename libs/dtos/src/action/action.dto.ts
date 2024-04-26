import { z } from 'zod';

import { ActionType } from './action-type.enum';

export const BaseActionDTO = z.object({
  type: z.string(),
  payload: z.unknown(),
});

export type BaseAction = z.infer<typeof BaseActionDTO>;

export const OpenURLActionDTO = BaseActionDTO.extend({
  type: z.literal(ActionType.OPEN_URL),
  payload: z.object({
    url: z.string(),
  }),
});

export type OpenURLAction = z.infer<typeof OpenURLActionDTO>;
