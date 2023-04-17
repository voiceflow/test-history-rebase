import { styled } from '@/hocs/styled';

export const HeaderOffsetContainer = styled.div`
  position: absolute;
  left: 0;
  top: ${({ theme }) => theme.components.page.header.height}px;
  bottom: 0;
`;
