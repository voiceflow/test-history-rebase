import { Animations, FlexCenter, OverflowText, System } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';

import type { ItemNameContainerProps } from '../../../ItemNameContainer';
import ItemNameContainer from '../../../ItemNameContainer';
import ItemNameIcon from '../../../ItemNameIcon';

export const Icon = styled(ItemNameIcon).attrs({ size: 9, icon: 'arrowRightTopics' })<IconProps>`
  ${transition('color', 'transform')}

  ${({ isOpened }) =>
    isOpened &&
    css`
      transform: rotate(90deg);
    `}
`;

export const AddButton = styled(System.IconButton.Base).attrs({
  size: System.IconButton.Size.XS,
})<System.IconButton.I.Props>`
  ${({ active }) =>
    active &&
    css`
      display: flex !important;
    `}
`;

export const Container = styled(ItemNameContainer)<ItemNameContainerProps & { isSubtopic?: boolean }>`
  ${({ isSubtopic }) =>
    isSubtopic &&
    css`
      margin: 0px;
    `}

  ${AddButton} {
    display: none;
  }

  &:hover {
    ${AddButton} {
      ${Animations.fadeInStyle}
      display: flex;
    }
  }

  ${Icon} {
    opacity: 0.65;
  }

  &:hover ${Icon} {
    opacity: 0.85;
  }

  ${({ isActive }) =>
    isActive &&
    css`
      ${Icon} {
        opacity: 0.85;
      }
    `}
`;

interface IconProps {
  isOpened?: boolean;
}

export const IconContainer = styled(FlexCenter)`
  width: 24px;
  min-width: 24px;
  height: 24px;
  margin-right: 6px;
`;

export const NameWrapper = styled(OverflowText)`
  line-height: normal;
`;
