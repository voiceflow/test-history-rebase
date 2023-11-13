import { z } from 'zod';

import { FunctionCompiledNodeDTO } from './function/compiled-node.dto';
import { FunctionNodeDTO } from './function/node.dto';

export const CompiledNodeDTO = z.discriminatedUnion('type', [FunctionCompiledNodeDTO]);

export type CompiledNode = z.infer<typeof CompiledNodeDTO>;

export const NodeDTO = z.discriminatedUnion('type', [FunctionNodeDTO]);

export type Node = z.infer<typeof NodeDTO>;
