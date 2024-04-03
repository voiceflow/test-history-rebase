import { WorkflowDTO } from '@voiceflow/dtos';

import { validatorZodFactory } from './validator/validator.util';

export const workflowNameValidator = validatorZodFactory(WorkflowDTO.shape.name);
