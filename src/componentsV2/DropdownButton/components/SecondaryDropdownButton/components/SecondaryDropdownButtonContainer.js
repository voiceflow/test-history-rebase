import styled, { css } from 'styled-components';

import SecondaryButton from '@/componentsV2/Button/components/SecondaryButton';

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
