import { z } from 'zod';

import { CompiledExpressionConditionDTO } from './expression-condition/expression-condition.compiled.dto';
import { CompiledPromptConditionDTO } from './prompt-condition/prompt-condition.compiled.dto';
import { CompiledScriptConditionDTO } from './script-condition/script-condition.compiled.dto';

export type { CompiledExpressionCondition } from './expression-condition/expression-condition.compiled.dto';
export { CompiledExpressionConditionDTO } from './expression-condition/expression-condition.compiled.dto';
export type { CompiledPromptCondition } from './prompt-condition/prompt-condition.compiled.dto';
export { CompiledPromptConditionDTO } from './prompt-condition/prompt-condition.compiled.dto';
export type { CompiledScriptCondition } from './script-condition/script-condition.compiled.dto';
export { CompiledScriptConditionDTO } from './script-condition/script-condition.compiled.dto';

export const AnyCompiledConditionDTO = z.discriminatedUnion('type', [
  CompiledPromptConditionDTO,
  CompiledScriptConditionDTO,
  CompiledExpressionConditionDTO,
]);

export type AnyCompiledCondition = z.infer<typeof AnyCompiledConditionDTO>;
