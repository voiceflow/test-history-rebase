import z from 'zod';

// TODO: define and manage later
export const SlateTextValueDTO = z.object({
  id: z.string(),
  content: z.any(),

  /** @deprecated use TextTracePayload.delay instead */
  messageDelayMilliseconds: z.number().optional(),
});

export type SlateTextValue = z.infer<typeof SlateTextValueDTO>;
