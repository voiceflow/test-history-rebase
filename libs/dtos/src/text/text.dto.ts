import z from 'zod';

// TODO: define and manage later
export const SlateTextValueDTO = z.any();

export type SlateTextValue = z.infer<typeof SlateTextValueDTO>;