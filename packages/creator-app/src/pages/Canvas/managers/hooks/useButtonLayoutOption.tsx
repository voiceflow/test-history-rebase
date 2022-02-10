import { BaseButton } from '@voiceflow/base-types';
import { OptionsMenuOption, toast } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import * as Prototype from '@/ducks/prototype';
import { useDispatch, useSelector } from '@/hooks';
import MenuCheckboxOption from '@/pages/Canvas/managers/components/MenuCheckboxOption';
import { PlatformContext } from '@/pages/Project/contexts';
import { getPlatformValue } from '@/utils/platform';

const buttonLayoutLabel = {
  [BaseButton.ButtonsLayout.STACKED]: 'Stacked',
  [BaseButton.ButtonsLayout.CAROUSEL]: 'Carousel',
};

const useButtonLayoutOption = (): OptionsMenuOption => {
  const buttons = useSelector(Prototype.prototypeButtonsSelector) ?? BaseButton.ButtonsLayout.STACKED;
  const updateSharePrototypeSettings = useDispatch(Prototype.updateSharePrototypeSettings);

  const platform = React.useContext(PlatformContext)!;

  const updateButtons = async (buttons: BaseButton.ButtonsLayout) => {
    await updateSharePrototypeSettings({ buttons });
    toast.success(
      `Global ${getPlatformValue(platform, { [VoiceflowConstants.PlatformType.GOOGLE]: 'chips' }, 'buttons')} layout updated to '${
        buttonLayoutLabel[buttons]
      }'`
    );
  };

  return {
    label: `${getPlatformValue(platform, { [VoiceflowConstants.PlatformType.GOOGLE]: 'Chips' }, 'Buttons')} Layout`,
    options: [
      {
        label: (
          <MenuCheckboxOption checked={buttons === BaseButton.ButtonsLayout.STACKED} onChange={() => updateButtons(BaseButton.ButtonsLayout.STACKED)}>
            Stacked
          </MenuCheckboxOption>
        ),
        disabled: true,
      },
      {
        label: (
          <MenuCheckboxOption
            checked={buttons === BaseButton.ButtonsLayout.CAROUSEL}
            onChange={() => updateButtons(BaseButton.ButtonsLayout.CAROUSEL)}
          >
            Carousel
          </MenuCheckboxOption>
        ),
        disabled: true,
      },
    ],
  };
};

export default useButtonLayoutOption;
