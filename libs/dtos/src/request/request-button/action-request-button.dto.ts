import type { z } from 'zod';

import { ActionRequestDTO } from '../action-request.dto';
import { BaseRequestButtonDTO } from './base-request-button.dto';

export const ActionRequestButtonDTO = BaseRequestButtonDTO.extend({
  request: ActionRequestDTO,
});

export type ActionRequestButton = z.infer<typeof ActionRequestButtonDTO>;
