import { BaseNode } from '@voiceflow/base-types';
import { Checkbox, OptionsMenuOption } from '@voiceflow/ui';
import React from 'react';

import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';
import MenuCheckboxOption from '@/pages/Canvas/managers/components/MenuCheckboxOption';

export const LABELS = {
  OPTION: 'Canvas visibility',
  PREVIEW: 'Show preview',
  VARIANTS: 'Show all variants',
  SET_DEFAULT: 'Set as default',
};

type Labels = Record<keyof typeof LABELS, string>;

const useCanvasVisibilityOption = (
  visibility: BaseNode.Utils.CanvasNodeVisibility = BaseNode.Utils.CanvasNodeVisibility.PREVIEW,
  onChange: (visibility: BaseNode.Utils.CanvasNodeVisibility) => void,
  labels: Labels = LABELS
): OptionsMenuOption => {
  const patchSettings = useDispatch(VersionV2.patchSettings);
  const defaultCanvasNodeVisibility = useSelector(VersionV2.active.canvasNodeVisibilitySelector);

  const defaultCanvasVisibility = defaultCanvasNodeVisibility || BaseNode.Utils.CanvasNodeVisibility.PREVIEW;

  const updateDefaultCanvasVisibility = React.useCallback((value: BaseNode.Utils.CanvasNodeVisibility) => {
    patchSettings({ defaultCanvasNodeVisibility: value });
  }, []);

  return {
    label: labels.OPTION,
    options: [
      {
        label: (
          <MenuCheckboxOption
            checked={visibility === BaseNode.Utils.CanvasNodeVisibility.PREVIEW}
            onChange={() => onChange(BaseNode.Utils.CanvasNodeVisibility.PREVIEW)}
          >
            {labels.PREVIEW}
          </MenuCheckboxOption>
        ),
        readOnly: true,
      },
      {
        label: (
          <MenuCheckboxOption
            checked={visibility === BaseNode.Utils.CanvasNodeVisibility.ALL_VARIANTS}
            onChange={() => onChange(BaseNode.Utils.CanvasNodeVisibility.ALL_VARIANTS)}
          >
            {labels.VARIANTS}
          </MenuCheckboxOption>
        ),
        readOnly: true,
      },
      { label: '', readOnly: true, menuItemProps: { style: { marginBottom: 0 }, divider: true } },
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
            {labels.SET_DEFAULT}
          </MenuCheckboxOption>
        ),
        readOnly: true,
        menuItemProps: { ending: true },
      },
    ],
    menuProps: { noBottomPadding: true },
  };
};

export default useCanvasVisibilityOption;
