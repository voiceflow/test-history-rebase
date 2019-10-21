import styled from 'styled-components';

import InlineFormControl from '@/components/InlineFormControl';

const SpeakElementHeader = styled(InlineFormControl)`
  flex: 1;
  max-width: 100%;

  & > button.close {
    margin: 0 ${({ theme }) => theme.unit}px;
    margin-right: 0;
  }

  & .speak-box {
    flex: 1;
  }
`;

export default SpeakElementHeader;
