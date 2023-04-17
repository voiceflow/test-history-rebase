import { Input as BaseInput, InputVariant } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const ItemNameInput = styled(BaseInput).attrs({ variant: InputVariant.INLINE })`
  flex: 1;
  overflow: hidden;
`;

export default ItemNameInput;
