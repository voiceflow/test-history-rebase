import { z } from 'zod';

export const CompiledFunctionInvocationDTO = z
  .object({
    paths: z.record(z.string()).describe('Mapping of path code to next step id'),
    inputVars: z.record(z.string()).describe('Mapping of input variable name to its argument value'),
    outputVars: z
      .record(z.string().nullable())
      .describe('Mapping of output variable name to its assignment target, a canvas variable'),
  })
  .strict();

export type CompiledFunctionInvocation = z.infer<typeof CompiledFunctionInvocationDTO>;
