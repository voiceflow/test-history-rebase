import { Node } from '@voiceflow/base-types';
import { OptionsMenuOption } from '@voiceflow/ui';
import React from 'react';

import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';
import MenuCheckboxOption, { CheckboxType } from '@/pages/Canvas/managers/components/MenuCheckboxOption';

const useCanvasVisibilityOption = (
  visibility: Node.Utils.CanvasNodeVisibility = Node.Utils.CanvasNodeVisibility.PREVIEW,
  onChange: (visibility: Node.Utils.CanvasNodeVisibility) => void
): OptionsMenuOption => {
  const patchSettings = useDispatch(Version.patchSettings);
  const defaultCanvasNodeVisibility = useSelector(VersionV2.active.canvasNodeVisibilitySelector);

  const defaultCanvasVisibility = defaultCanvasNodeVisibility || Node.Utils.CanvasNodeVisibility.PREVIEW;

  const updateDefaultCanvasVisibility = React.useCallback((value: Node.Utils.CanvasNodeVisibility) => {
    patchSettings({ defaultCanvasNodeVisibility: value });
  }, []);

  return {
    label: 'Canvas Visibility',
    options: [
      {
        label: (
          <MenuCheckboxOption
            checked={visibility === Node.Utils.CanvasNodeVisibility.PREVIEW}
            onChange={() => onChange(Node.Utils.CanvasNodeVisibility.PREVIEW)}
          >
            Show preview
          </MenuCheckboxOption>
        ),
        disabled: true,
      },
      {
        label: (
          <MenuCheckboxOption
            checked={visibility === Node.Utils.CanvasNodeVisibility.ALL_VARIANTS}
            onChange={() => onChange(Node.Utils.CanvasNodeVisibility.ALL_VARIANTS)}
          >
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
                defaultCanvasVisibility === Node.Utils.CanvasNodeVisibility.PREVIEW
                  ? Node.Utils.CanvasNodeVisibility.ALL_VARIANTS
                  : Node.Utils.CanvasNodeVisibility.PREVIEW
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
