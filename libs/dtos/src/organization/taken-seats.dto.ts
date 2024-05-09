import { z } from 'zod';

export const TakenSeatsDTO = z.object({
  viewers: z.number(),
  editors: z.number(),
});

export type TakenSeats = z.infer<typeof TakenSeatsDTO>;
