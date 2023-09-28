import { z } from 'nestjs-zod/z';

export const BaseResource = z.object({
  id: z.string().uuid(),
});
