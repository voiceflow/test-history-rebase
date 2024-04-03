import { FlowDTO } from '@voiceflow/dtos';

import { validatorZodFactory } from './validator/validator.util';

export const flowNameValidator = validatorZodFactory(FlowDTO.shape.name);
