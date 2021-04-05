import { FlexCenter } from '@/components/Flex';
import { css, styled } from '@/hocs';

type ContainerProps = {
  hasBorderRight: boolean;
};

const Container = styled(FlexCenter)<ContainerProps>`
  padding: 24px;
  flex-direction: column;
  flex: 1;
  align-self: flex-start;

  ${({ hasBorderRight }) =>
    hasBorderRight &&
    css`
      border-right: solid 1px #e3e9ec;
    `}
`;

export default Container;
