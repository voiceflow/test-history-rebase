import { InvoiceDTO } from '@voiceflow/dtos';
import { z } from 'nestjs-zod/z';

export const GetInvoicesResponse = z.object({
  invoices: z.array(InvoiceDTO),
  nextCursor: z.string().nullable(),
});

export type GetInvoicesResponse = z.infer<typeof GetInvoicesResponse>;
