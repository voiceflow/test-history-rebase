import { Flex, inputStyle, SelectWrapper } from '@voiceflow/ui';

import { css, styled } from '@/hocs';

interface ContainerProps {
  multiline?: boolean;
  variablesInput?: boolean;
}

const Container = styled(Flex)<ContainerProps>`
  ${inputStyle};
  display: flex;
  overflow: hidden;

  ${SelectWrapper} {
    height: 40px;
    margin: -10px 0 -10px -16px;
    cursor: pointer;

    input {
      cursor: pointer;
    }
  }

  ${({ multiline }) =>
    multiline &&
    css`
      align-items: flex-start;
    `};

  ${({ variablesInput }) =>
    variablesInput &&
    css`
      padding-top: 9px;
      padding-bottom: 9px;
    `}
`;

export default Container;
