import { FlexCenter, SvgIcon } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';

interface IconProps {
  isOpened?: boolean;
}

export const IconContainer = styled(FlexCenter)`
  width: 24px;
  min-width: 24px;
  height: 24px;
  margin-right: 5px;
`;

export const Icon = styled(SvgIcon).attrs({ size: 9, icon: 'arrowRightTopics' })<IconProps>`
  ${transition('color', 'transform')}

  ${({ isOpened }) =>
    isOpened &&
    css`
      transform: rotate(90deg);
    `}
`;
