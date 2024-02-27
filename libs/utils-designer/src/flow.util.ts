import type { Flow } from '@voiceflow/dtos';

import { composeValidators, validatorFactory } from './validator/validator.util';

export const flowNameUniqValidator = validatorFactory(
  (name: string, { flows }: { flows: Flow[] }) =>
    flows.every((flow) => flow.name.toLocaleLowerCase() !== name.toLocaleLowerCase()),
  () => `flow name already exists.`
);

export const flowNameValidator = composeValidators(flowNameUniqValidator);
