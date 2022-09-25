import { styled } from '@/hocs';

export const Text = styled.div`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.fontSizes.s}px;
`;
