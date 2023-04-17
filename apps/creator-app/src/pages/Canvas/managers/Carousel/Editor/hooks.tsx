import { BaseNode } from '@voiceflow/base-types';
import { Checkbox, OptionsMenuOption } from '@voiceflow/ui';
import React from 'react';

import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';
import MenuCheckboxOption from '@/pages/Canvas/managers/components/MenuCheckboxOption';

const baseOption = {
  menuItemProps: { style: { cursor: 'initial' } },
  disabled: true,
};

export const useCarouselLayoutOption = (
  layout: BaseNode.Carousel.CarouselLayout,
  onChange: (layout: BaseNode.Carousel.CarouselLayout) => void
): OptionsMenuOption => {
  const patchSettings = useDispatch(Version.patchSettings);
  const savedCarouselLayout = useSelector(VersionV2.active.carouselLayoutSelector);
  const defaultCarouselLayout = savedCarouselLayout || BaseNode.Carousel.CarouselLayout.CAROUSEL;

  const toggleDefaultCarouselLayout = React.useCallback(() => {
    const value =
      defaultCarouselLayout === BaseNode.Carousel.CarouselLayout.CAROUSEL
        ? BaseNode.Carousel.CarouselLayout.LIST
        : BaseNode.Carousel.CarouselLayout.CAROUSEL;
    return patchSettings({ defaultCarouselLayout: value });
  }, [defaultCarouselLayout]);

  return {
    label: 'Buttons layout',
    options: [
      {
        ...baseOption,
        label: (
          <MenuCheckboxOption
            checked={layout === BaseNode.Carousel.CarouselLayout.CAROUSEL}
            onChange={() => onChange(BaseNode.Carousel.CarouselLayout.CAROUSEL)}
          >
            Carousel
          </MenuCheckboxOption>
        ),
      },
      {
        label: (
          <MenuCheckboxOption
            checked={layout === BaseNode.Carousel.CarouselLayout.LIST}
            onChange={() => onChange(BaseNode.Carousel.CarouselLayout.LIST)}
          >
            List
          </MenuCheckboxOption>
        ),
        ...baseOption,
      },
      { label: '', readOnly: true, menuItemProps: { style: { marginBottom: 0 }, divider: true } },
      {
        label: (
          <MenuCheckboxOption type={Checkbox.Type.CHECKBOX} checked={defaultCarouselLayout === layout} onChange={toggleDefaultCarouselLayout}>
            Set as default
          </MenuCheckboxOption>
        ),
        readOnly: true,
        menuItemProps: { ...baseOption.menuItemProps, ending: true },
      },
    ],
    menuProps: { noBottomPadding: true },
  };
};
