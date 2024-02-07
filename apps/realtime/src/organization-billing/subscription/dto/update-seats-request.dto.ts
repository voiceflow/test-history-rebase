import { z } from 'nestjs-zod/z';

export const UpdateSeatsRequest = z.object({
  seats: z.number(),
});

export type UpdateSeatsRequest = z.infer<typeof UpdateSeatsRequest>;
