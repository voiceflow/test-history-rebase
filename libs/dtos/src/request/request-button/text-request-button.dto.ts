import type { z } from 'zod';

import { TextRequestDTO } from '../text-request.dto';
import { BaseRequestButtonDTO } from './base-request-button.dto';

export const TextRequestButtonDTO = BaseRequestButtonDTO.extend({
  request: TextRequestDTO,
});

export type TextRequestButton = z.infer<typeof TextRequestButtonDTO>;
