import { FlexCenter, PrimaryButton } from '@voiceflow/ui';
import styled from 'styled-components';

const PrimaryDropdownButtonContainer = styled(FlexCenter)`
  & ${PrimaryButton.Container} {
    margin-right: 2px;
  }

  & ${PrimaryButton.Container}:not(:first-of-type) {
    margin-right: 0;
    border-top-left-radius: 14px;
    border-bottom-left-radius: 14px;
  }

  & ${PrimaryButton.Container}:not(:last-of-type) {
    border-top-right-radius: 14px;
    border-bottom-right-radius: 14px;
  }

  & ${PrimaryButton.Container}:last-of-type {
    margin-right: 0;
  }
`;

export default PrimaryDropdownButtonContainer;
