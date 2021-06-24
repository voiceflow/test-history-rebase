import { Flex, inputStyle, SelectWrapper } from '@voiceflow/ui';

import { css, styled } from '@/hocs';

const Container = styled(Flex)`
  ${inputStyle};
  display: flex;
  overflow: hidden;

  ${SelectWrapper} {
    height: 40px;
    margin: -10px 0 -10px -16px;
  }

  ${({ regularInput }) =>
    !regularInput &&
    css`
      padding-top: 9px;
      padding-bottom: 9px;
    `}
`;

export default Container;
