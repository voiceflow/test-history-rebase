import styled from 'styled-components';

import PrimaryButtonContainer from '@/components/Button/components/PrimaryButton/components/PrimaryButtonContainer';
import { FlexCenter } from '@/components/Flex';

const PrimaryDropdownButtonContainer = styled(FlexCenter)`
  & ${PrimaryButtonContainer} {
    margin-right: 2px;
  }

  & ${PrimaryButtonContainer}:not(:first-of-type) {
    border-top-left-radius: 14px;
    border-bottom-left-radius: 14px;
    margin-right: 0;
  }

  & ${PrimaryButtonContainer}:not(:last-of-type) {
    border-top-right-radius: 14px;
    border-bottom-right-radius: 14px;
  }

  & ${PrimaryButtonContainer}:last-of-type {
    margin-right: 0;
  }
`;

export default PrimaryDropdownButtonContainer;
