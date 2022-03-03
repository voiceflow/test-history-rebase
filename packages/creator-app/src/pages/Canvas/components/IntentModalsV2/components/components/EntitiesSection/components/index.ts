import { transition } from '@voiceflow/ui';

import { css, styled } from '@/hocs';

export const RequiredEntity = styled.div<{ active: boolean }>`
  ${transition('background')}
  background: transparent;
  padding: 10px 14px;
  cursor: pointer;
  border-radius: 6px;
  font-size: 15px;
  flex: 10;
  margin-right: 16px;
  display: flex;

  ${({ active }) =>
    active &&
    css`
      background: #eef4f6;
    `}

  :hover {
    background: #eef4f6;
  }
`;
