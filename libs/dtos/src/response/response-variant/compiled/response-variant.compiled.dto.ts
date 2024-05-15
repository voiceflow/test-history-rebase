import { z } from 'zod';

import { CompiledPromptResponseVariantDTO } from './prompt-variant.compiled.dto';
import { CompiledTextResponseVariantDTO } from './text-variant.compiled.dto';

export type { CompiledPromptResponseVariant } from './prompt-variant.compiled.dto';
export { CompiledPromptResponseVariantDTO } from './prompt-variant.compiled.dto';
export type { CompiledTextResponseVariant } from './text-variant.compiled.dto';
export { CompiledTextResponseVariantDTO } from './text-variant.compiled.dto';

export const AnyCompiledResponseVariantDTO = z.union([
  CompiledPromptResponseVariantDTO,
  CompiledTextResponseVariantDTO,
]);

export type AnyCompiledResponseVariant = z.infer<typeof AnyCompiledResponseVariantDTO>;
