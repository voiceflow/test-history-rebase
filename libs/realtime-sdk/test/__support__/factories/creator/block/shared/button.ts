import { faker } from '@faker-js/faker';
import { BaseButton } from '@voiceflow/base-types';
import { define } from 'cooky-cutter';

export const ButtonChip = define<BaseButton.Chip>({
  label: () => faker.lorem.word(),
});

export const IntentButton = define<BaseButton.IntentButton>({
  type: () => faker.helpers.arrayElement(Object.values(BaseButton.ButtonType)),
  name: () => faker.lorem.word(),
  payload: () => ({ intentID: faker.datatype.uuid() }),
});

export const BUTTON_STEP_DATA_FACTORY_CONFIG = {
  chips: (): BaseButton.Chip[] => [ButtonChip()],
  buttons: (): BaseButton.IntentButton[] => [IntentButton()],
};

export const ButtonStepData = define<BaseButton.StepButton>(BUTTON_STEP_DATA_FACTORY_CONFIG);
