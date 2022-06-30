import { Input as BaseInput, InputVariant } from '@voiceflow/ui';

import { styled } from '@/hocs';

const ItemNameInput = styled(BaseInput).attrs({ variant: InputVariant.INLINE })`
  flex: 1;
`;

export default ItemNameInput;
