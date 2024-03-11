import { z } from 'zod';

export const VersionPrototypeStackFrameDTO = z
  .object({
    nodeID: z.string().nullable().optional(),
    storage: z.record(z.unknown()).optional(),
    commands: z.array(z.object({ type: z.string() }).passthrough()).optional(),
    diagramID: z.string(),
    variables: z.record(z.unknown()).optional(),
  })
  .strict();

export type VersionPrototypeStackFrame = z.infer<typeof VersionPrototypeStackFrameDTO>;

export const VersionPrototypeContextDTO = z
  .object({
    turn: z.record(z.unknown()).optional(),
    stack: z.array(VersionPrototypeStackFrameDTO).optional(),
    storage: z.record(z.unknown()).optional(),
    variables: z.record(z.unknown()).optional(),
  })
  .strict();

export type VersionPrototypeContext = z.infer<typeof VersionPrototypeContextDTO>;
