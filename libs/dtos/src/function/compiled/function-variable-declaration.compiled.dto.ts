import { z } from 'zod';

import { VariableDatatype } from '../../variable/variable-datatype.enum';

export const CompiledFunctionVariableDeclarationDTO = z
  .object({
    type: z
      .nativeEnum(VariableDatatype)
      .refine(
        (val) => val === VariableDatatype.STRING || val === VariableDatatype.ANY || val === VariableDatatype.TEXT,
        {
          message: `Function variables currently only support the 'text' or 'any' type`,
        }
      )
      .describe('The type of the Function variable. Used to render suitable UI and perform data validation.'),
  })
  .strict();

export type CompiledFunctionVariableDeclaration = z.infer<typeof CompiledFunctionVariableDeclarationDTO>;
