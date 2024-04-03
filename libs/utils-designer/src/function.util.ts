import { FunctionDTO } from '@voiceflow/dtos';

import { validatorZodFactory } from './validator/validator.util';

export const functionNameValidator = validatorZodFactory(FunctionDTO.shape.name);
