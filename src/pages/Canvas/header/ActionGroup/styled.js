import { withProps } from 'recompose';
import styled, { keyframes } from 'styled-components';

import SvgIcon from '@/components/SvgIcon';
import { ANIMATION_SPEED } from '@/styles/theme';

export const SubTitleGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 24px;
  border-left: 1px solid #eaeff4;
`;

const slideIn = keyframes`
  from {
    transform: translate3d(0, 10px, 0);
    opacity: 0;
  }
  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const PopupTransition = styled.div`
  transform: translate3d(0, 0, 0);
  animation: ${slideIn} 150ms ease-in-out 150ms;
  animation-fill-mode: both;
  width: 100%;
`;

const CloseIcon = styled(SvgIcon)`
  cursor: pointer;
  color: #becedc;
  transition: color ${ANIMATION_SPEED}s ease;

  & :hover {
    color: #6e849a;
  }
`;

export const Close = withProps({ icon: 'close', size: 12 })(CloseIcon);

export const PopupContainer = styled.div`
  display: ${({ open }) => (open ? 'flex' : 'none')};
  position: absolute;
  top: 62px;
  right: 15px;
  z-index: 1;
  flex-direction: column;
  align-items: center;
  min-width: 350px;
  max-width: 350px;
  white-space: normal;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.06), 0 8px 16px 0 rgba(17, 49, 96, 0.16);
  overflow: hidden;
  transform: translate3d(0, 0, 0);
  animation: ${fadeIn} 150ms ease-in-out;

  ${CloseIcon} {
    position: absolute;
    top: 0px;
    right: 0px;
    padding: 18px;
    z-index: 100;
  }
`;
