import { z } from 'nestjs-zod/z';

import { OrganizationBaseRequestQuery } from '@/organization/dto/organization-base-request-query.dto';

export const GetInvoicesRequestQuery = OrganizationBaseRequestQuery.extend({
  ids: z.array(z.string()).optional(),
  limit: z.coerce.number().positive().max(100).default(10),
  cursor: z.string().optional(),
});

export type GetInvoicesRequestQuery = z.infer<typeof GetInvoicesRequestQuery>;
