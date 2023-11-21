import type { z } from 'zod';

import { ProgramDTO } from '../program/program.dto';

export const PrototypeProgramDTO = ProgramDTO.extend({}).strict();

export type PrototypeProgramDTO = z.infer<typeof PrototypeProgramDTO>;
