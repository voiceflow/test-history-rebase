import { z } from 'zod';

export const KBTagDTO = z.object({
  tagID: z.string(),
  label: z.string(),
});

export type KBTag = z.infer<typeof KBTagDTO>;

export const KBTagRecordDTO = z.record(z.string(), KBTagDTO);

export type KBTagRecord = z.infer<typeof KBTagRecordDTO>;
