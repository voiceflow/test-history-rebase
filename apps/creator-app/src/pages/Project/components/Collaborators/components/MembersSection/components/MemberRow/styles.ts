import { FlexApart, User } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';
import { FadeLeft } from '@/styles/animations';

export const Container = styled(FlexApart)<{ isLast?: boolean }>`
  ${FadeLeft}

  padding: 12px 32px 12px 0px;
  font-size: 15px;
  overflow-x: hidden;
  overflow-x: clip;

  ${({ isLast }) =>
    !isLast &&
    css`
      border-bottom: 1px solid #eaeff4;
    `}
`;

export const UserIcon = styled(User)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;

  span {
    width: 18px;
    height: 18px;
  }
`;

export const MemberName = styled.div`
  color: #132144;
  text-transform: capitalize;
  margin-bottom: 2px;
`;

export const MemberEmail = styled.div<{ pending?: boolean }>`
  font-size: ${({ pending }) => (pending ? 15 : 13)}px;
  color: ${({ pending }) => (pending ? '#8da2b5' : '#62778c')};
  overflow-x: hidden;
  text-overflow: ellipsis;
  padding-right: 12px;
`;
