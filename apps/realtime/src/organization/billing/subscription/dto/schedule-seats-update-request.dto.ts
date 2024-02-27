import { z } from 'nestjs-zod/z';

export const ScheduleSeatsUpdateRequest = z.object({
  seats: z.number(),
});

export type ScheduleSeatsUpdateRequest = z.infer<typeof ScheduleSeatsUpdateRequest>;
