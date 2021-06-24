import { css, styled, transition } from '../../../styles';
import { SvgIconContainer } from '../../SvgIcon';
import IconButtonContainer from './IconButtonContainer';

export type OutlineContainerProps = {
  preventFocusStyle?: boolean;
};

const activeStyle = css`
  color: rgba(19, 33, 68, 0.85);
  background: #eef4f6cc;
  border: 1px solid #dfe3ed;
  box-shadow: none !important;

  &:hover {
    color: rgba(19, 33, 68, 0.85);
  }
`;

const OutlineContainer = styled(IconButtonContainer)<OutlineContainerProps>`
  color: #8da2b5;
  background: #fff;
  border: 1px solid #eaeff4;
  box-shadow: none !important;
  ${transition('border', 'background', 'color', 'box-shadow')}

  ${SvgIconContainer} {
    opacity: 1;
  }

  &:hover {
    color: #6e849a;
    border: 1px solid #dfe3ed;
    box-shadow: none;
  }

  &:active {
    ${activeStyle}
  }

  ${({ preventFocusStyle }) =>
    !preventFocusStyle &&
    css`
      &:focus {
        color: #132144;
        background: #eef4f6cc;
        border: 1px solid #dfe3ed;
        box-shadow: none !important;
      }
    `}

  ${({ active }) => active && activeStyle}
`;

export default OutlineContainer;
