import { styled } from '@/hocs/styled';

export const MembersColumn = styled.div`
  width: 500px;
  padding: 20px 32px 32px;
  border-right: 1px solid ${({ theme }) => theme.colors.separatorSecondary};
`;

export const SummaryColumn = styled.div`
  width: 378px;
`;

export const MemberList = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.separatorSecondary};
  margin: 20px -32px 16px -32px;
`;
