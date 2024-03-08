import { z } from 'zod';

export const PrototypeSlotDTO = z
  .object({
    key: z.string(),
    name: z.string(),
    type: z.object({ value: z.string().optional() }),
    color: z.string().optional(),
    inputs: z.array(z.string()),
  })
  .strict();

export type PrototypeSlot = z.infer<typeof PrototypeSlotDTO>;

export const PrototypeIntentInputDTO = z
  .object({
    text: z.string(),
    slots: z.array(z.string()).optional(),
  })
  .strict();

export type PrototypeIntentInput = z.infer<typeof PrototypeIntentInputDTO>;

export const PrototypeIntentSlotDialogDTO = z
  .object({
    prompt: z.array(z.unknown()),
    confirm: z.array(z.unknown()),
    utterances: z.array(PrototypeIntentInputDTO),
    confirmEnabled: z.boolean(),
  })
  .strict();

export type PrototypeIntentSlotDialog = z.infer<typeof PrototypeIntentSlotDialogDTO>;

export const PrototypeIntentSlotDTO = z
  .object({
    id: z.string(),
    dialog: PrototypeIntentSlotDialogDTO,
    required: z.boolean(),
  })
  .strict();

export type PrototypeIntentSlot = z.infer<typeof PrototypeIntentSlotDTO>;

export const PrototypeIntentDTO = z
  .object({
    key: z.string(),
    name: z.string(),
    slots: z.array(PrototypeIntentSlotDTO).optional(),
    inputs: z.array(PrototypeIntentInputDTO),
    noteID: z.string().optional(),
    description: z.string().optional(),
  })
  .strict();

export type PrototypeIntent = z.infer<typeof PrototypeIntentDTO>;

export const PrototypeModelDTO = z
  .object({
    slots: z.array(PrototypeSlotDTO),
    intents: z.array(PrototypeIntentDTO),
  })
  .strict();

export type PrototypeModel = z.infer<typeof PrototypeModelDTO>;
