import Flex from '@/componentsV2/Flex';
import { inputStyle } from '@/componentsV2/Input/styles';
import { SelectWrapper } from '@/componentsV2/Select/components';
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
