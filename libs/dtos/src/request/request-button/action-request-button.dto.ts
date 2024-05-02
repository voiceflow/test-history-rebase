import { z } from 'zod';

import { ActionRequestDTO } from '../action-request.dto';

export const ActionRequestButtonDTO = z.object({
  request: ActionRequestDTO,
});

export type ActionRequestButton = z.infer<typeof ActionRequestButtonDTO>;
