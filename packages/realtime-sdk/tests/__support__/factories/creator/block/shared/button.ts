import { Button } from '@voiceflow/base-types';
import { define } from 'cooky-cutter';
import { datatype, lorem, random } from 'faker';

export const ButtonChip = define<Button.Chip>({
  label: () => lorem.word(),
});

export const IntentButton = define<Button.IntentButton>({
  type: () => random.arrayElement(Object.values(Button.ButtonType)),
  name: () => lorem.word(),
  payload: () => ({ intentID: datatype.uuid() }),
});

export const BUTTON_STEP_DATA_FACTORY_CONFIG = {
  chips: (): Button.Chip[] => [ButtonChip()],
  buttons: (): Button.IntentButton[] => [IntentButton()],
};

export const ButtonStepData = define<Button.StepButton>(BUTTON_STEP_DATA_FACTORY_CONFIG);
