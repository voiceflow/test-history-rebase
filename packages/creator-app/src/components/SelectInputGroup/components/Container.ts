import { Flex, SelectWrapper } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

interface ContainerProps {
  error?: boolean;
  isLeft?: boolean;
  multiline?: boolean;
  variablesInput?: boolean;
}

const Container = styled(Flex)<ContainerProps>`
  display: flex;
  overflow: hidden;

  ${SelectWrapper} {
    height: 42px;
    margin: ${({ isLeft }) => (isLeft ? '-11px -16px -11px 0' : '-11px 0 -11px -16px')};
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
      padding-top: 10px;
      padding-bottom: 10px;
    `}
`;

export default Container;
