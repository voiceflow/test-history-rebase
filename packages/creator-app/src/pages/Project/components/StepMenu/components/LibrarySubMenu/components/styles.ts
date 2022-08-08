import { Text } from '@voiceflow/ui';
import styled from 'styled-components';

export const Label = styled(Text)`
  display: block;
  font-size: 15px;
  min-width: 142px;
  max-width: 230px;
  line-height: 21px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;
