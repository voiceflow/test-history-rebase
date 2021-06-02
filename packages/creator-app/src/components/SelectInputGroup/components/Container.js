import Flex from '@/components/Flex';
import { inputStyle } from '@/components/Input/styles';
import { SelectWrapper } from '@/components/Select/components';
import { css, styled } from '@/hocs';

const Container = styled(Flex)`
  ${inputStyle};
  display: flex;
  overflow: hidden;

  ${SelectWrapper} {
    margin: -10px 0 -10px -16px;
    height: 40px;
  }

  ${({ regularInput }) =>
    !regularInput &&
    css`
      padding-top: 9px;
      padding-bottom: 9px;
    `}
`;

export default Container;
