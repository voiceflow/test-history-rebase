import { FlexCenter, PrimaryButtonContainer } from '@voiceflow/ui';
import styled from 'styled-components';

const PrimaryDropdownButtonContainer = styled(FlexCenter)`
  & ${PrimaryButtonContainer} {
    margin-right: 2px;
  }

  & ${PrimaryButtonContainer}:not(:first-of-type) {
    margin-right: 0;
    border-top-left-radius: 14px;
    border-bottom-left-radius: 14px;
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
