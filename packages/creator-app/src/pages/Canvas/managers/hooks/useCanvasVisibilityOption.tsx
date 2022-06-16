import { BaseNode } from '@voiceflow/base-types';
import { Checkbox, OptionsMenuOption } from '@voiceflow/ui';
import React from 'react';

import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';
import MenuCheckboxOption from '@/pages/Canvas/managers/components/MenuCheckboxOption';

const useCanvasVisibilityOption = (
  visibility: BaseNode.Utils.CanvasNodeVisibility = BaseNode.Utils.CanvasNodeVisibility.PREVIEW,
  onChange: (visibility: BaseNode.Utils.CanvasNodeVisibility) => void
): OptionsMenuOption => {
  const patchSettings = useDispatch(Version.patchSettings);
  const defaultCanvasNodeVisibility = useSelector(VersionV2.active.canvasNodeVisibilitySelector);

  const defaultCanvasVisibility = defaultCanvasNodeVisibility || BaseNode.Utils.CanvasNodeVisibility.PREVIEW;

  const updateDefaultCanvasVisibility = React.useCallback((value: BaseNode.Utils.CanvasNodeVisibility) => {
    patchSettings({ defaultCanvasNodeVisibility: value });
  }, []);

  return {
    label: 'Canvas Visibility',
    options: [
      {
        label: (
          <MenuCheckboxOption
            checked={visibility === BaseNode.Utils.CanvasNodeVisibility.PREVIEW}
            onChange={() => onChange(BaseNode.Utils.CanvasNodeVisibility.PREVIEW)}
          >
            Show preview
          </MenuCheckboxOption>
        ),
        disabled: true,
      },
      {
        label: (
          <MenuCheckboxOption
            checked={visibility === BaseNode.Utils.CanvasNodeVisibility.ALL_VARIANTS}
            onChange={() => onChange(BaseNode.Utils.CanvasNodeVisibility.ALL_VARIANTS)}
          >
            Show all variants
          </MenuCheckboxOption>
        ),
        disabled: true,
      },
      { label: '', disabled: true, menuItemProps: { style: { marginBottom: 0 }, divider: true } },
      {
        label: (
          <MenuCheckboxOption
            type={Checkbox.Type.CHECKBOX}
            checked={defaultCanvasVisibility === visibility}
            onChange={() =>
              updateDefaultCanvasVisibility(
                defaultCanvasVisibility === BaseNode.Utils.CanvasNodeVisibility.PREVIEW
                  ? BaseNode.Utils.CanvasNodeVisibility.ALL_VARIANTS
                  : BaseNode.Utils.CanvasNodeVisibility.PREVIEW
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
