import { Button } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';
import { OptionsMenuOption, toast } from '@voiceflow/ui';
import React from 'react';

import * as Prototype from '@/ducks/prototype';
import { useDispatch, useSelector } from '@/hooks';
import MenuCheckboxOption from '@/pages/Canvas/managers/components/MenuCheckboxOption';
import { PlatformContext } from '@/pages/Project/contexts';
import { getPlatformValue } from '@/utils/platform';

const buttonLayoutLabel = {
  [Button.ButtonsLayout.STACKED]: 'Stacked',
  [Button.ButtonsLayout.CAROUSEL]: 'Carousel',
};

const useButtonLayoutOption = (): OptionsMenuOption => {
  const buttons = useSelector(Prototype.prototypeButtonsSelector) ?? Button.ButtonsLayout.STACKED;
  const updateSharePrototypeSettings = useDispatch(Prototype.updateSharePrototypeSettings);

  const platform = React.useContext(PlatformContext)!;

  const updateButtons = async (buttons: Button.ButtonsLayout) => {
    await updateSharePrototypeSettings({ buttons });
    toast.success(
      `Global ${getPlatformValue(platform, { [Constants.PlatformType.GOOGLE]: 'chips' }, 'buttons')} layout updated to '${
        buttonLayoutLabel[buttons]
      }'`
    );
  };

  return {
    label: `${getPlatformValue(platform, { [Constants.PlatformType.GOOGLE]: 'Chips' }, 'Buttons')} Layout`,
    options: [
      {
        label: (
          <MenuCheckboxOption checked={buttons === Button.ButtonsLayout.STACKED} onChange={() => updateButtons(Button.ButtonsLayout.STACKED)}>
            Stacked
          </MenuCheckboxOption>
        ),
        disabled: true,
      },
      {
        label: (
          <MenuCheckboxOption checked={buttons === Button.ButtonsLayout.CAROUSEL} onChange={() => updateButtons(Button.ButtonsLayout.CAROUSEL)}>
            Carousel
          </MenuCheckboxOption>
        ),
        disabled: true,
      },
    ],
  };
};

export default useButtonLayoutOption;
