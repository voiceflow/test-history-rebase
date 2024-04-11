import { z } from 'zod';

import { FunctionCompiledNodeDTO } from './function/function-compiled-node.dto';
import { FunctionNodeDTO } from './function/function-node.dto';
import { StartCompiledNodeDTO } from './start/start-compiled-node.dto';
import { StartNodeDTO } from './start/start-node.dto';

export const CompiledNodeDTO = z.discriminatedUnion('type', [StartCompiledNodeDTO, FunctionCompiledNodeDTO]);

export type CompiledNode = z.infer<typeof CompiledNodeDTO>;

export const NodeDTO = z.discriminatedUnion('type', [StartNodeDTO, FunctionNodeDTO]);

export type Node = z.infer<typeof NodeDTO>;
