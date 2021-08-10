import { ButtonsLayout } from '@voiceflow/general-types';
import { PlatformType } from '@voiceflow/internal';
import { OptionsMenuOption, toast } from '@voiceflow/ui';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as Prototype from '@/ducks/prototype';
import MenuCheckboxOption from '@/pages/Canvas/managers/components/MenuCheckboxOption';
import { PlatformContext } from '@/pages/Skill/contexts';
import { getPlatformValue } from '@/utils/platform';

const buttonLayoutLabel = {
  [ButtonsLayout.STACKED]: 'Stacked',
  [ButtonsLayout.CAROUSEL]: 'Carousel',
};

const useButtonLayoutOption = (): OptionsMenuOption => {
  const buttons = useSelector(Prototype.prototypeButtonsSelector) ?? ButtonsLayout.STACKED;
  const dispatch = useDispatch();

  const platform = React.useContext(PlatformContext)!;

  const updateButtons = async (buttons: ButtonsLayout) => {
    await dispatch(Prototype.updateSharePrototypeSettings({ buttons }));
    toast.success(
      `Global ${getPlatformValue(platform, { [PlatformType.GOOGLE]: 'chips' }, 'buttons')} layout updated to '${buttonLayoutLabel[buttons]}'`
    );
  };

  return {
    label: `${getPlatformValue(platform, { [PlatformType.GOOGLE]: 'Chips' }, 'Buttons')} Layout`,
    options: [
      {
        label: (
          <MenuCheckboxOption checked={buttons === ButtonsLayout.STACKED} onChange={() => updateButtons(ButtonsLayout.STACKED)}>
            Stacked
          </MenuCheckboxOption>
        ),
        disabled: true,
      },
      {
        label: (
          <MenuCheckboxOption checked={buttons === ButtonsLayout.CAROUSEL} onChange={() => updateButtons(ButtonsLayout.CAROUSEL)}>
            Carousel
          </MenuCheckboxOption>
        ),
        disabled: true,
      },
    ],
  };
};

export default useButtonLayoutOption;
