import { z } from 'zod';

export const InvoiceDTO = z.object({
  id: z.string(),
  date: z.string().nullable(),
});

export type Invoice = z.infer<typeof InvoiceDTO>;
