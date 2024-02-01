import { z } from 'nestjs-zod/z';

export const GetInvoicesRequestQuery = z.object({
  ids: z.array(z.string()).optional(),
  limit: z.coerce.number().positive().max(100).default(10),
  cursor: z.string().optional(),
});

export type GetInvoicesRequestQuery = z.infer<typeof GetInvoicesRequestQuery>;
