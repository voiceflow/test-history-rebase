import React from 'react';
import AutosizeInput, { AutosizeInputProps } from 'react-input-autosize';
import { mapProps } from 'recompose';

import { BlockVariant } from '@/constants/canvas';
import { styled, transition, withBlockVariantStyle } from '@/hocs';
import {
  CANVAS_COMMENTING_ENABLED,
  CANVAS_CREATING_LINK_CLASSNAME,
  CANVAS_MERGING_CLASSNAME,
  CANVAS_SELECTING_GROUP_CLASSNAME,
  NODE_ACTIVE_CLASSNAME,
} from '@/pages/Canvas/constants';

type HeaderInputProps = AutosizeInputProps & {
  canEdit?: boolean;
  variant: BlockVariant;
  viewOnlyMode: boolean;
};

const HeaderInput = styled(
  mapProps<AutosizeInputProps, HeaderInputProps>(({ canEdit, variant, ...props }) => ({
    ...props,
  }))(AutosizeInput)
)
  // for some reason I NEED to place box sizing inline for the title to not get cropped on first render in chrome}
  .attrs({ style: { boxSizing: 'content-box' } })<HeaderInputProps>`
  max-width: 100%;

  .${CANVAS_MERGING_CLASSNAME} &,
  .${CANVAS_SELECTING_GROUP_CLASSNAME} &,
  .${CANVAS_CREATING_LINK_CLASSNAME} & {
    pointer-events: none;
  }

  input {
    max-width: 100%;
    box-sizing: content-box !important;
    ${transition('background')};
    font-size: 15px;
    font-weight: 600;
    padding: 0 5px;
    text-align: center;
    border: none;
    white-space: nowrap;
    background: transparent;
    border-radius: 3px;
    outline: none;
    text-overflow: ellipsis;
    cursor: text;
    overflow: hidden;
    user-select: ${({ readOnly }) => readOnly && 'none'};
    pointer-events: ${({ viewOnlyMode }) => viewOnlyMode && 'none'};
    color: ${withBlockVariantStyle((variant) => variant.color)};

    :hover {
      background: ${({ theme, variant, canEdit }) => canEdit && theme.components.block.variants[variant].editTitleColor};
    }

    :focus {
      background: ${({ theme, variant, canEdit, readOnly }) => !readOnly && canEdit && theme.components.block.variants[variant].editTitleColor};
    }

    :active {
      background: transparent;
    }
    .${CANVAS_COMMENTING_ENABLED} & {
      cursor: crosshair;
    }
  }

  .${NODE_ACTIVE_CLASSNAME} input {
    color: ${withBlockVariantStyle((variant) => variant.activeColor)};
  }
`;

export default React.memo(HeaderInput);
