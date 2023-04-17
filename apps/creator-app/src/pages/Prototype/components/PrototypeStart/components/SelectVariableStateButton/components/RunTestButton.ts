import { Button, PrimaryButtonProps } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

interface RunTestButtonProps extends PrimaryButtonProps {
  withIconButton: boolean;
}

const RunTestButton = styled(Button)<RunTestButtonProps>`
  ${({ withIconButton }) =>
    withIconButton &&
    css`
      border-top-right-radius: 2px !important;
      border-bottom-right-radius: 2px !important;
      margin-right: 1px;
      cursor: pointer;
      width: 108px;
    `}
`;

export default RunTestButton;
