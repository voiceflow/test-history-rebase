import styled, { css } from 'styled-components';

import SecondaryButton from '@/componentsV2/Button/components/SecondaryButton';

const OverflowMenuContainer = styled(SecondaryButton)`
  color: rgba(110, 132, 154, 0.85);

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
    `}
`;

export default OverflowMenuContainer;
