import { BaseNode } from '@voiceflow/base-types';
import { OptionsMenuOption } from '@voiceflow/ui';
import React from 'react';

import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';
import MenuCheckboxOption, { CheckboxType } from '@/pages/Canvas/managers/components/MenuCheckboxOption';

const baseOption = {
  menuItemProps: { style: { cursor: 'initial' } },
  disabled: true,
};

export const useCardLayoutOption = (
  layout: BaseNode.CardV2.CardLayout,
  onChange: (layout: BaseNode.CardV2.CardLayout) => void
): OptionsMenuOption => {
  const patchSettings = useDispatch(Version.patchSettings);
  const savedCardLayout = useSelector(VersionV2.active.cardLayoutSelector);
  const defaultCardLayout = savedCardLayout || BaseNode.CardV2.CardLayout.CAROUSEL;

  const toggleDefaultCardLayout = React.useCallback(() => {
    const value = defaultCardLayout === BaseNode.CardV2.CardLayout.CAROUSEL ? BaseNode.CardV2.CardLayout.LIST : BaseNode.CardV2.CardLayout.CAROUSEL;
    return patchSettings({ defaultCardLayout: value });
  }, [defaultCardLayout]);

  return {
    label: 'Buttons layout',
    options: [
      {
        ...baseOption,
        label: (
          <MenuCheckboxOption checked={layout === BaseNode.CardV2.CardLayout.CAROUSEL} onChange={() => onChange(BaseNode.CardV2.CardLayout.CAROUSEL)}>
            Carousel
          </MenuCheckboxOption>
        ),
      },
      {
        label: (
          <MenuCheckboxOption checked={layout === BaseNode.CardV2.CardLayout.LIST} onChange={() => onChange(BaseNode.CardV2.CardLayout.LIST)}>
            List
          </MenuCheckboxOption>
        ),
        ...baseOption,
      },
      { label: '', disabled: true, menuItemProps: { style: { marginBottom: 0 }, divider: true } },
      {
        label: (
          <MenuCheckboxOption type={CheckboxType.CHECKBOX} checked={defaultCardLayout === layout} onChange={toggleDefaultCardLayout}>
            Set as default
          </MenuCheckboxOption>
        ),
        disabled: true,
        menuItemProps: { ...baseOption.menuItemProps, ending: true },
      },
    ],
    menuProps: { noBottomPadding: true },
  };
};
