import styled from 'styled-components';

import PrimaryButtonContainer from '@/componentsV2/Button/components/PrimaryButton/components/PrimaryButtonContainer';
import { FlexCenter } from '@/componentsV2/Flex';

const PrimaryDropdownButtonContainer = styled(FlexCenter)`
  & ${PrimaryButtonContainer} {
    margin-right: 1px;
  }

  & ${PrimaryButtonContainer}:not(:first-of-type) {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    margin-right: 0;
  }

  & ${PrimaryButtonContainer}:not(:last-of-type) {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }

  & ${PrimaryButtonContainer}:last-of-type {
    margin-right: 0;
  }
`;

export default PrimaryDropdownButtonContainer;
