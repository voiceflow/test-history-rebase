import { z } from 'zod';

import { CompiledFunctionVariableDeclarationDTO } from './function-variable-declaration.compiled.dto';

export type { CompiledFunctionVariableDeclaration } from './function-variable-declaration.compiled.dto';
export { CompiledFunctionVariableDeclarationDTO } from './function-variable-declaration.compiled.dto';

export const CompiledFunctionDefinitionDTO = z
  .object({
    codeId: z.string().describe("Amazon S3 bucket key of the .js file containing this Function's code"),
    inputVars: z
      .record(CompiledFunctionVariableDeclarationDTO)
      .describe('Mapping of input variable name to its variable declaration.'),
    outputVars: z
      .record(CompiledFunctionVariableDeclarationDTO)
      .describe('Mapping of output variable name to its variable declaration.'),
    pathCodes: z.array(z.string()).describe('List of valid return codes for a function'),
  })
  .strict();

export type CompiledFunctionDefinition = z.infer<typeof CompiledFunctionDefinitionDTO>;
