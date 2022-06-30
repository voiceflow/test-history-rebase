import { FlexCenter, SvgIcon } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs';

interface IconProps {
  isActive?: boolean;
  isOpened?: boolean;
}

export const IconContainer = styled(FlexCenter)`
  width: 22px;
  min-width: 22px;
  height: 22px;
  margin-right: 3px;
`;

export const Icon = styled(SvgIcon).attrs({ size: 9, icon: 'arrowRightTopics', color: '#becedc' })<IconProps>`
  ${transition('color', 'transform')}

  ${({ isOpened }) =>
    isOpened &&
    css`
      transform: rotate(90deg);
    `}

  ${({ isActive }) =>
    isActive &&
    css`
      color: #a5b7c7;
    `}
`;
