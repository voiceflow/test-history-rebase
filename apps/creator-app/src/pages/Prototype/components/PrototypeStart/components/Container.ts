import { FlexCenter, Text } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const Container = styled(FlexCenter).attrs({ column: true })`
  top: 15%;
  position: relative;
  justify-content: center;
  align-items: center;
  padding-bottom: 20px;

  ${Text} {
    text-align: center;
    white-space: pre-line;
    min-width: 271px;
    max-width: 271px;
  }
`;

export default Container;
