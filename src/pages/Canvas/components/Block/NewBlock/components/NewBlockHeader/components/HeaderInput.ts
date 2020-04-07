import React from 'react';
import AutosizeInput, { AutosizeInputProps } from 'react-input-autosize';
import { mapProps } from 'recompose';

import { BlockVariant } from '@/constants/canvas';
import { styled, transition } from '@/hocs';

type HeaderInputProps = AutosizeInputProps & {
  canEdit?: boolean;
  variant: BlockVariant;
};

const HeaderInput = styled(
  mapProps<AutosizeInputProps, HeaderInputProps>(({ canEdit, variant, ...props }) => ({
    ...props,
    // for some reason I NEED to place box sizing inline for the title to not get cropped on first render in chrome}
    style: { boxSizing: 'content-box' },
  }))(AutosizeInput)
)<HeaderInputProps>`
  max-width: 100%;
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
    color: ${({ theme, variant }) => theme.components.block.variants[variant].color};

    :hover {
      background: ${({ theme, variant, canEdit }) => canEdit && theme.components.block.variants[variant].editTitleColor};
    }

    :focus {
      background: ${({ theme, variant, canEdit, readOnly }) => !readOnly && canEdit && theme.components.block.variants[variant].editTitleColor};
    }

    :active {
      background: transparent;
    }
  }
`;

export default React.memo(HeaderInput);
