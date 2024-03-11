import { z } from 'zod';

export const VersionPrototypeMessageDelayDTO = z
  .object({
    durationMilliseconds: z.number(),
  })
  .strict();

export type VersionPrototypeMessageDelay = z.infer<typeof VersionPrototypeMessageDelayDTO>;

export const VersionPrototypeDataDTO = z
  .object({
    name: z.string(),
    locales: z.array(z.string()),
    messageDelay: z.optional(VersionPrototypeMessageDelayDTO),
  })
  .strict();

export type VersionPrototypeData = z.infer<typeof VersionPrototypeDataDTO>;
