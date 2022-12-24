import { styled } from '@/hocs/styled';

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: ${({ theme }) => theme.components.page.header.height}px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borders};
  z-index: 10;
`;
