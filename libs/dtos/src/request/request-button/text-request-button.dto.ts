import { z } from 'zod';

import { TextRequestDTO } from '../text-request.dto';

export const TextRequestButtonDTO = z.object({
  request: TextRequestDTO,
});

export type TextRequestButton = z.infer<typeof TextRequestButtonDTO>;
