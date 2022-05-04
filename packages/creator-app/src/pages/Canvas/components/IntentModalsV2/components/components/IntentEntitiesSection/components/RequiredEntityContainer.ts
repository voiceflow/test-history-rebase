import { SvgIconContainer, transition } from '@voiceflow/ui';

import { css, styled } from '@/hocs';

const RequiredEntity = styled.div<{ active: boolean }>`
  ${transition('background')}
  background: transparent;
  padding: 10px 14px;
  cursor: pointer;
  border-radius: 6px;
  font-size: 15px;
  flex: 10;
  margin-right: 16px;
  display: flex;

  ${SvgIconContainer} {
    opacity: 0.8;
  }

  &:hover {
    background: #eef4f6;

    ${SvgIconContainer} {
      opacity: 1;
    }
  }

  ${({ active }) =>
    active &&
    css`
      background: #eef4f6;
    `}
`;

export default RequiredEntity;
