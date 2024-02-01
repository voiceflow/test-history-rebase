import { z } from 'zod';

export const InvoiceDTO = z.object({
  id: z.string(),
  date: z.string().nullable(),
});

export type InvoiceDTO = z.infer<typeof InvoiceDTO>;
