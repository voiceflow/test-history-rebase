import { SecondaryButton } from '@voiceflow/ui';
import styled, { css } from 'styled-components';

const OverflowMenuContainer = styled(SecondaryButton)`
  color: rgba(110, 132, 154, 0.85);

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
    `}
`;

export default OverflowMenuContainer;
