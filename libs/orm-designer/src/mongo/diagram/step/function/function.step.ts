import { z } from 'zod';

import { Markup } from '@/common/dtos/markup.dto';

import { NodePortsByKey, NodePortsWithNext } from '../../node/node.dto';
import { NodeType } from '../../node/node-type.enum';
import { Step } from '../step.dto';

export const FunctionPorts = z.intersection(NodePortsWithNext, NodePortsByKey);

export type FunctionPorts = z.infer<typeof FunctionPorts>;

export const FunctionStepData = z.object({
  functionID: z.string().uuid().nullable(),
  inputMapping: z.record(Markup.nullable()),
  outputMapping: z.record(z.string().uuid().nullable()),
});

export type FunctionStepData = z.infer<typeof FunctionStepData>;

export const FunctionStep = Step(NodeType.STEP__FUNCTION__V3, FunctionStepData, FunctionPorts);

export type FunctionStep = z.infer<typeof FunctionStep>;
