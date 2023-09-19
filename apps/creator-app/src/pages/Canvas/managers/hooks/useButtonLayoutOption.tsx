import { BaseButton } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import { OptionsMenuOption } from '@voiceflow/ui';
import { toast } from '@voiceflow/ui-next';
import React from 'react';

import * as Prototype from '@/ducks/prototype';
import { useActiveProjectPlatform, useDispatch, useSelector } from '@/hooks';
import MenuCheckboxOption from '@/pages/Canvas/managers/components/MenuCheckboxOption';
import { getPlatformValue } from '@/utils/platform';

const buttonLayoutLabel = {
  [BaseButton.ButtonsLayout.STACKED]: 'Stacked',
  [BaseButton.ButtonsLayout.CAROUSEL]: 'Carousel',
};

const useButtonLayoutOption = (): OptionsMenuOption => {
  const layout = useSelector(Prototype.prototypeButtonsSelector) ?? BaseButton.ButtonsLayout.STACKED;
  const updateSharePrototypeSettings = useDispatch(Prototype.updateSharePrototypeSettings);

  const platform = useActiveProjectPlatform();

  const updateButtons = async (layout: BaseButton.ButtonsLayout) => {
    await updateSharePrototypeSettings({ buttons: layout });

    toast.success(
      `Global ${getPlatformValue(platform, { [Platform.Constants.PlatformType.GOOGLE]: 'chips' }, 'buttons')} layout updated to '${
        buttonLayoutLabel[layout]
      }'`
    );
  };

  return {
    label: `${getPlatformValue(platform, { [Platform.Constants.PlatformType.GOOGLE]: 'Chips' }, 'Buttons')} layout`,
    options: [
      {
        label: <MenuCheckboxOption checked={layout === BaseButton.ButtonsLayout.STACKED}>Stacked</MenuCheckboxOption>,
        onClick: () => updateButtons(BaseButton.ButtonsLayout.STACKED),
      },
      {
        label: <MenuCheckboxOption checked={layout === BaseButton.ButtonsLayout.CAROUSEL}>Carousel</MenuCheckboxOption>,
        onClick: () => updateButtons(BaseButton.ButtonsLayout.CAROUSEL),
      },
    ],
  };
};

export default useButtonLayoutOption;
