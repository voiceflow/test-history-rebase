import { SecondaryButton } from '@voiceflow/ui';
import styled, { css } from 'styled-components';

import Toggle from './SecondaryDropdownButtonToggle';

const SecondaryDropdownButtonContainer = styled(SecondaryButton)`
  ${({ disabled }) =>
    disabled &&
    css`
      & ${Toggle} {
        opacity: 0.5;
      }
    `}
`;

export default SecondaryDropdownButtonContainer;
