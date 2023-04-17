import { styled } from '@/hocs/styled';

export const HeaderContainer = styled.div`
  padding: 16px 24px;
  margin-bottom: 8px;
  border-top: 1px solid;
  border-color: ${({ theme }) => theme.colors.borders};
  height: 48px;
`;

export const ContentContainer = styled.div`
  background: rgba(249, 249, 249, 0.6);
  padding: 16px 16px;
  border-top: 1px solid;
  border-color: ${({ theme }) => theme.colors.borders};
`;
