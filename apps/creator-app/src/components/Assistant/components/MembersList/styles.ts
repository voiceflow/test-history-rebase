import { BlockText } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

export const Header = styled.div<{ border?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 32px;

  ${({ border }) =>
    border &&
    css`
      &::before {
        display: block;
        left: 32px;
        right: 0;
        bottom: 0;
        content: '';
        position: absolute;
        border-top: 1px solid #eaeff4;
      }
    `}
`;
export const Title = styled(BlockText)`
  color: #132144;
  margin-bottom: 2px;
  width: 220px;
`;

export const Subtitle = styled(BlockText)`
  color: #62778c;
  font-size: 13px;
`;
