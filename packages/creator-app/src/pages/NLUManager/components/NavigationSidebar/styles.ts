import { SvgIcon } from '@voiceflow/ui';

import { styled, transition } from '@/hocs';

export const ImportTooltipTitle = styled.div`
  text-transform: capitalize;
`;

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
  border-right: 1px solid ${({ theme }) => theme.colors.borders};
  width: 248px;
  min-width: 248px;
  margin-left: ${({ theme }) => theme.components.sidebarIconMenu.width}px;
  background: #fbfbfb;
`;

export const ItemsContainer = styled.div`
  display: flex;
  padding: 16px;
  flex: 1;
  flex-direction: column;
  position: relative;
`;

export const StatusBubble = styled.div`
  position: relative;
  right: 6px;

  &:after {
    position: absolute;
    left: 31px;
    bottom: 28px;
    display: block;
    width: 4px;
    height: 4px;
    outline: solid 1px #fff;
    border-radius: 50%;
    background-color: #3d82e2;
    content: '';
  }
`;

export const Footer = styled.div`
  ${transition('background')}
  border-top: 1px solid ${({ theme }) => theme.colors.borders};
  padding: 20px 32px;
  font-weight: 600;
  display: flex;
  align-items: center;
  font-size: 15px;
  cursor: pointer;
  background: rgba(238, 244, 246, 1);

  &:hover,
  &:active {
    background: rgba(238, 244, 246, 1);
  }

  ${SvgIcon.Container} {
    opacity: 0.85;
    transform: rotate(90deg);
  }

  &:hover,
  &:active {
    ${SvgIcon.Container} {
      opacity: 1;
      transform: translateX(-4px) rotate(90deg);
    }
  }
`;
