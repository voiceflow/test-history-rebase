import { z } from 'zod';

export const VersionPrototypeSettingsDTO = z
  .object({
    avatar: z.string().optional(),
    layout: z.string().optional(),
    buttons: z.string().optional(),
    password: z.string().optional(),
    brandColor: z.string().optional(),
    brandImage: z.string().optional(),
    hasPassword: z.boolean().optional(),
    buttonsOnly: z.boolean().optional(),
    variableStateID: z.string().optional(),
  })
  .strict();

export type VersionPrototypeSettings = z.infer<typeof VersionPrototypeSettingsDTO>;
