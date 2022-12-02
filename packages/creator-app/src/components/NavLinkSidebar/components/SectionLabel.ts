import { flexStyles } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs';

const GroupLabel = styled.div<{ isActive?: boolean }>`
  ${flexStyles}
  ${transition('color')}

  width: 100%;
  height: ${({ theme }) => theme.components.navSidebar.itemHeight}px;
  margin-top: 8px;
  font-size: 15px;
  letter-spacing: 0.2px;
  padding-left: 32px;
  color: #132144;
  font-weight: 600;

  ${({ isActive }) =>
    isActive &&
    css`
      color: #5d9df5;
    `};

  &:first-child {
    margin-top: 0;
  }
`;

export default GroupLabel;
