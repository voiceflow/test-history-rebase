import { styled } from '@/hocs/styled';

const Container = styled.div`
  z-index: ${({ theme }) => theme.zIndex.popper};
  max-width: 440px;
  width: 440px;
  max-height: 350px;
  padding: 24px 32px;
  overflow-x: hidden;
  overflow-y: scroll;
`;

export default Container;
