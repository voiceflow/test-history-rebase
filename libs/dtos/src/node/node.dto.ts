import { z } from 'zod';

import { CompiledFunctionNodeDTO } from './function/compiled/function-node.compiled.dto';
import { FunctionNodeDTO } from './function/function-node.dto';
import { CompiledStartNodeDTO } from './start/start-node.compiled.dto';
import { StartNodeDTO } from './start/start-node.dto';

export const CompiledNodeDTO = z.discriminatedUnion('type', [CompiledStartNodeDTO, CompiledFunctionNodeDTO]);

export type CompiledNode = z.infer<typeof CompiledNodeDTO>;

export const NodeDTO = z.discriminatedUnion('type', [StartNodeDTO, FunctionNodeDTO]);

export type Node = z.infer<typeof NodeDTO>;
