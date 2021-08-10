import { CanvasNodeVisibility } from '@voiceflow/general-types';
import { OptionsMenuOption } from '@voiceflow/ui';
import React from 'react';

import * as Version from '@/ducks/version';
import { useDispatch, useSelector } from '@/hooks';
import MenuCheckboxOption, { CheckboxType } from '@/pages/Canvas/managers/components/MenuCheckboxOption';

const useCanvasVisibilityOption = (
  visibility: CanvasNodeVisibility = CanvasNodeVisibility.PREVIEW,
  onChange: (visibility: CanvasNodeVisibility) => void
): OptionsMenuOption => {
  const saveSettings = useDispatch(Version.saveSettings);
  const defaultCanvasNodeVisibility = useSelector(Version.activeCanvasNodeVisibilitySelector);

  const defaultCanvasVisibility = defaultCanvasNodeVisibility || CanvasNodeVisibility.PREVIEW;

  const updateDefaultCanvasVisibility = React.useCallback((value: CanvasNodeVisibility) => {
    saveSettings({ defaultCanvasNodeVisibility: value });
  }, []);

  return {
    label: 'Canvas Visibility',
    options: [
      {
        label: (
          <MenuCheckboxOption checked={visibility === CanvasNodeVisibility.PREVIEW} onChange={() => onChange(CanvasNodeVisibility.PREVIEW)}>
            Show preview
          </MenuCheckboxOption>
        ),
        disabled: true,
      },
      {
        label: (
          <MenuCheckboxOption checked={visibility === CanvasNodeVisibility.ALL_VARIANTS} onChange={() => onChange(CanvasNodeVisibility.ALL_VARIANTS)}>
            Show all variants
          </MenuCheckboxOption>
        ),
        disabled: true,
      },
      { label: 'divider', disabled: true, menuItemProps: { style: { marginBottom: 0 }, divider: true } },
      {
        label: (
          <MenuCheckboxOption
            type={CheckboxType.CHECKBOX}
            checked={defaultCanvasVisibility === visibility}
            onChange={() =>
              updateDefaultCanvasVisibility(
                defaultCanvasVisibility === CanvasNodeVisibility.PREVIEW ? CanvasNodeVisibility.ALL_VARIANTS : CanvasNodeVisibility.PREVIEW
              )
            }
          >
            Set as default
          </MenuCheckboxOption>
        ),
        disabled: true,
        menuItemProps: { ending: true },
      },
    ],
    menuProps: { noBottomPadding: true },
  };
};

export default useCanvasVisibilityOption;
