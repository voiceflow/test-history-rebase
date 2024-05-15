import { z } from 'zod';

import { CMSBaseResourceDTO } from '@/common';

import { ConditionType } from '../condition-type.enum';
import { CompiledExpressionConditionDataDTO } from './expression-condition/expression-condition-data.compiled.dto';
import { CompiledPromptConditionDataDTO } from './prompt-condition/prompt-condition-data.compiled.dto';
import { CompiledScriptConditionDataDTO } from './script-condition/script-condition-data.compiled.dto';

export const BaseCompiledConditionDTO = CMSBaseResourceDTO.extend({
  type: z.nativeEnum(ConditionType),
  data: z.union([CompiledPromptConditionDataDTO, CompiledScriptConditionDataDTO, CompiledExpressionConditionDataDTO]),
}).strict();
