import { styled } from '@/hocs';

const HeaderOffsetContainer = styled.div`
  position: absolute;
  left: 0;
  top: ${({ theme }) => theme.components.page.header.height}px;
  bottom: 0;
`;

export default HeaderOffsetContainer;
