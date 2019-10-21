import Flex from '@/componentsV2/Flex';
import { css, styled } from '@/hocs';

const Container = styled(Flex)`
  flex-direction: column;
  ${({ center }) =>
    center
      ? css`
          text-align: center;
        `
      : css`
          align-items: unset;
        `}

  & > * {
    padding: ${({ theme }) => theme.unit}px 0;
  }
`;

export default Container;
