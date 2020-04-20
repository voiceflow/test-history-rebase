import Flex from '@/components/Flex';
import { css, styled } from '@/hocs';

type ContainerProps = {
  isPublic?: boolean;
};

const Container = styled(Flex).attrs({ column: true })<ContainerProps>`
  height: 100%;
  width: 100%;
  overflow: hidden;

  & > * {
    width: 100%;
  }

  ${({ isPublic }) =>
    isPublic &&
    css`
      max-height: 600px;
      max-width: 500px;
      margin: auto;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.15);
    `}
`;

export default Container;
