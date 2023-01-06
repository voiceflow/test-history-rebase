import { Box, SvgIcon } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';
import { ClassName } from '@/styles/constants';

export interface ItemProps {
  small?: boolean;
  isActive?: boolean;
  withoutHover?: boolean;
}

export const ITEM_HEIGHT = 44;

export const Icon = styled(SvgIcon)``;

export const Item = styled(Box.FlexCenter)<ItemProps>`
  ${transition('color')}

  width: 100%;
  height: ${({ theme, small }) => (small ? theme.components.sidebarIconMenu.smallItemHeight : theme.components.sidebarIconMenu.itemHeight)}px;
  cursor: pointer;
  color: #6e849a;
  flex-direction: column;
  position: relative;

  ${Icon} {
    opacity: 0.65;
  }

  ${({ isActive }) =>
    isActive &&
    css`
      ${Icon} {
        opacity: 1;
      }

      color: #3d82e2;
      cursor: default;
      pointer-events: none;
    `}

  ${({ withoutHover }) =>
    !withoutHover &&
    css`
      &:hover {
        ${Icon} {
          opacity: 1;
        }
      }
    `}
`;

export const Container = styled(Box.FlexCenter)`
  width: 100%;
  height: 100%;
  padding: 20px 0;
  flex-direction: column;
  justify-content: flex-start;

  .${ClassName.TOOLTIP} {
    display: block;
    width: 100%;
  }
`;

export const StatusBubble = styled.div`
  position: absolute;
  top: 50%;
  right: 50%;
  display: block;
  width: 6px;
  height: 6px;
  margin-top: -9px;
  margin-right: -10px;
  border: solid 1px #fff;
  border-radius: 6px;
  background-image: linear-gradient(to bottom, rgba(224, 79, 120, 0.85), #e04f78 99%);
`;

export const Status = styled.div`
  position: absolute;
  top: 13px;
  right: 13px;
  color: #132144;
  font-size: 11px;
  font-weight: 600;
  text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
`;
