import AutosizeInput, { AutosizeInputProps } from 'react-input-autosize';
import { mapProps } from 'recompose';

import { BlockState, BlockVariant } from '@/constants/canvas';
import { styled, transition } from '@/hocs';

const ACTIVATED_STATES = [BlockState.ACTIVE, BlockState.SELECTED];

type HeaderInputProps = AutosizeInputProps & {
  canEdit?: boolean;
  variant: BlockVariant;
  state: BlockState;
};

const HeaderInput = styled(mapProps<AutosizeInputProps, HeaderInputProps>(({ canEdit, variant, state, ...props }) => props)(AutosizeInput))<
  HeaderInputProps
>`
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
    cursor: auto;
    overflow: hidden;
    color: ${({ variant, state, theme }) => {
      const isActivated = ACTIVATED_STATES.includes(state);
      const variantStyles = theme.components.block.variants[variant];
      return variantStyles[isActivated ? 'activeColor' : 'color'];
    }};

    :hover {
      background: ${({ theme, variant, canEdit }) => canEdit && theme.components.block.variants[variant].editTitleColor};
    }
    :focus {
      background: ${({ theme, variant, canEdit }) => canEdit && theme.components.block.variants[variant].editTitleColor};
    }
  }
`;

export default HeaderInput;
