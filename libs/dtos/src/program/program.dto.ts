import { z } from 'zod';

import { ProgramCommandDTO } from './program-command.dto';
import { ProgramLineDTO } from './program-line.dto';

export const ProgramDTO = z
  .object({
    _id: z.string(),

    name: z.string(),

    lines: z.record(ProgramLineDTO),

    startId: z.string(),

    legacyId: z.string().optional(),

    commands: ProgramCommandDTO.array(),

    diagramID: z.string(),

    versionID: z.string(),

    variables: z.string().array(),
  })
  .strict();

export type Program = z.infer<typeof ProgramDTO>;
