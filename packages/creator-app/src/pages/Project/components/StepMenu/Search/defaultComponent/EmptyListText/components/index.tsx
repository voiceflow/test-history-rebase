import { styled } from '@/hocs/styled';

export const Text = styled.div`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.fontSizes.s}px;
`;
