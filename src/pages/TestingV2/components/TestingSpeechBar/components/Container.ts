import { styled } from '@/hocs';

type ContainerProps = {
  isPublic?: boolean;
};

const Container = styled.div<ContainerProps>`
  position: fixed;
  left: ${({ isPublic }) => (isPublic ? 16 : 0)}px;
  right: ${({ isPublic }) => (isPublic ? 16 : 400)}px;
  bottom: 0;
  z-index: 1;
  margin: 0 auto;

  @media (min-width: 432px) {
    & {
      max-width: 600px;
    }
  }
`;

export default Container;
