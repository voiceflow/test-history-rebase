import { Input as BaseInput, InputVariant } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const Input = styled(BaseInput).attrs({ variant: InputVariant.INLINE })`
  flex: 1;
  padding: 8px 0;
  overflow-y: hidden;
`;

export default Input;
