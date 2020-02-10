import Flex from '@/components/Flex';
import { css, styled } from '@/hocs';

const Container = styled(Flex)`
  border-radius: 5px;
  height: ${({ height }) => `${height}px`};
  position: relative;
  color: #62778c;

  &:focus {
    outline: none;
  }

  ${({ isActive }) =>
    isActive &&
    css`
      outline: none;
    `}
`;

export default Container;
