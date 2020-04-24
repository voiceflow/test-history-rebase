import * as SvgIcon from '@/components/SvgIcon';
import { css, styled, transition } from '@/hocs';

import Container from './Container';

export type OutlineContainerProps = {
  preventFocusStyle?: boolean;
};

const OutlineContainer = styled(Container)<OutlineContainerProps>`
  border: 1px solid #eaeff4;
  box-shadow: none !important;
  background: #fff;
  color: #8da2b5;
  ${transition('border', 'background', 'color', 'box-shadow')}

  ${SvgIcon.Container} {
    opacity: 1;
  }

  &:hover {
    border: 1px solid #dfe3ed;
    box-shadow: none;
    color: #6e849a;
    box-shadow: none;
  }

  &:active {
    background: #eef4f6cc;
    color: rgba(19, 33, 68, 0.85);
    box-shadow: none !important;
    border: 1px solid #dfe3ed;
  }

  ${({ preventFocusStyle }) =>
    !preventFocusStyle &&
    css`
      &:focus {
        background: #eef4f6cc;
        color: #132144;
        box-shadow: none !important;
        border: 1px solid #dfe3ed;
      }
    `}
`;

export default OutlineContainer;
