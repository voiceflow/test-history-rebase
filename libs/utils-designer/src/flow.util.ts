import { FlowDTO } from '@voiceflow/dtos';

import { composeValidators, validatorZodFactory } from './validator/validator.util';

export const flowNameSpellingValidator = validatorZodFactory(FlowDTO.shape.name);

export const flowNameValidator = composeValidators(flowNameSpellingValidator);
