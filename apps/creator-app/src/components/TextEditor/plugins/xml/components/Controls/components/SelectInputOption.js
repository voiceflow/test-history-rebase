import { Input } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const SelectInputOption = styled(Input)`
  width: 100%;
  height: ${({ theme }) => theme.components.input.height}px;
  flex: 1;
  background: none;
  margin: 0 -24px;
  padding: 0 24px;
`;

export default SelectInputOption;
