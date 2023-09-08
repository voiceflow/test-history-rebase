import { baseButtonStyles, fontResetStyle } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';

interface TabProps {
  color?: string;
  isActive?: boolean;
  capitalize?: boolean;
}

const Tab = styled.button<TabProps>`
  ${fontResetStyle};
  ${baseButtonStyles}
  height: 100%;
  padding: 0 24px;
  background: inherit;
  font-size: 15px;
  font-weight: 600;
  line-height: 18px;
  text-transform: ${({ capitalize }) => (capitalize ? 'capitalize' : 'none')};
  user-select: none;
  cursor: pointer;
  color: #949db0;

  ${transition('color')};

  &:hover {
    text-decoration: none;
    color: #848da0;
    filter: brightness(90%);
  }

  ${({ color, isActive }) =>
    isActive &&
    css`
      color: ${color || '#5d9df5'};
      cursor: default;
      pointer-events: none;

      &:hover {
        color: #5d9df5;
      }
    `};
`;

export default Tab;
