import { z } from 'zod';

export const VersionFolderItemDTO = z
  .object({
    type: z.string(),
    sourceID: z.string(),
  })
  .strict();

export type VersionFolderItem = z.infer<typeof VersionFolderItemDTO>;

export const VersionFolderDTO = z
  .object({
    id: z.string(),
    name: z.string(),
    items: z.array(VersionFolderItemDTO),
  })
  .strict();

export type VersionFolder = z.infer<typeof VersionFolderDTO>;
