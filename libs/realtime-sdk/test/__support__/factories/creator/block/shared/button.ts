import { BaseButton } from '@voiceflow/base-types';
import { define } from 'cooky-cutter';
import { datatype, lorem, random } from 'faker';

export const ButtonChip = define<BaseButton.Chip>({
  label: () => lorem.word(),
});

export const IntentButton = define<BaseButton.IntentButton>({
  type: () => random.arrayElement(Object.values(BaseButton.ButtonType)),
  name: () => lorem.word(),
  payload: () => ({ intentID: datatype.uuid() }),
});

export const BUTTON_STEP_DATA_FACTORY_CONFIG = {
  chips: (): BaseButton.Chip[] => [ButtonChip()],
  buttons: (): BaseButton.IntentButton[] => [IntentButton()],
};

export const ButtonStepData = define<BaseButton.StepButton>(BUTTON_STEP_DATA_FACTORY_CONFIG);
