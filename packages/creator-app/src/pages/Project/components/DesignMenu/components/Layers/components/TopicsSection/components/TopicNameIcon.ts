import { SvgIcon } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs';

interface TopicNameIconProps {
  isActive?: boolean;
  isOpened?: boolean;
}

const TopicNameIcon = styled(SvgIcon).attrs({ size: 9, icon: 'arrowRightTopics', color: '#becedc' })<TopicNameIconProps>`
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

export default TopicNameIcon;
