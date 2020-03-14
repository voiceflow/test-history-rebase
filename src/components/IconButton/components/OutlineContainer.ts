import * as SvgIcon from '@/components/SvgIcon';
import { css, styled } from '@/hocs';

import Container from './Container';

export type OutlineContainerProps = {
  preventFocusStyle?: boolean;
};

const OutlineContainer = styled(Container)<OutlineContainerProps>`
  border: 1px solid #e2e9ec !important;
  box-shadow: none !important;
  background: #fff;
  color: #8da2b5;

  ${SvgIcon.Container} {
    opacity: 1;
  }

  &:hover {
    box-shadow: none;
    color: #6e849a;
    box-shadow: none;
  }

  &:active {
    background: #eef4f6cc;
    color: #132144;
    box-shadow: none !important;
    border: 1px solid #e2e9ec;
  }

  ${({ preventFocusStyle }) =>
    !preventFocusStyle &&
    css`
      &:focus {
        background: #eef4f6cc;
        color: #132144;
        box-shadow: none !important;
        border: 1px solid #e2e9ec;
      }
    `}
`;

export default OutlineContainer;
