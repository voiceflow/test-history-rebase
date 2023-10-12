import { z } from 'zod';

import { Link } from '../link/link.dto';

export const Port = z.object({
  key: z.string(),
  link: Link.nullable(),
});

export type Port = z.infer<typeof Port>;
