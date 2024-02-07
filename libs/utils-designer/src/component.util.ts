import type { Flow } from '@voiceflow/dtos';

import { composeValidators, validatorFactory } from './validator/validator.util';

export const componentNameUniqValidator = validatorFactory(
  (name: string, { components }: { components: Flow[] }) =>
    components.every((component) => component.name.toLocaleLowerCase() !== name.toLocaleLowerCase()),
  () => `Component name already exists.`
);

export const componentNameValidator = composeValidators(componentNameUniqValidator);
