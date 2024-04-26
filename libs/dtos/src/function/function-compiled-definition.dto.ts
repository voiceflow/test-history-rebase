import { z } from 'zod';

import { VariableDatatype } from '../variable/variable-datatype.enum';

export const FunctionCompiledVariableDeclarationDTO = z
  .object({
    type: z
      .nativeEnum(VariableDatatype)
      .refine(
        (val) => val === VariableDatatype.STRING || val === VariableDatatype.ANY || val === VariableDatatype.TEXT,
        {
          message: "Function variables currently only support the 'text' or 'any' type",
        }
      )
      .describe('The type of the Function variable. Used to render suitable UI and perform data validation.'),
  })
  .strict();

export type FunctionCompiledVariableDeclaration = z.infer<typeof FunctionCompiledVariableDeclarationDTO>;

export const FunctionCompiledDefinitionDTO = z
  .object({
    codeId: z.string().describe("Amazon S3 bucket key of the .js file containing this Function's code"),
    inputVars: z
      .record(FunctionCompiledVariableDeclarationDTO)
      .describe('Mapping of input variable name to its variable declaration.'),
    outputVars: z
      .record(FunctionCompiledVariableDeclarationDTO)
      .describe('Mapping of output variable name to its variable declaration.'),
    pathCodes: z.array(z.string()).describe('List of valid return codes for a function'),
  })
  .strict();

export type FunctionCompiledDefinition = z.infer<typeof FunctionCompiledDefinitionDTO>;
