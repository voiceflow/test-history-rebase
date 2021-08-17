import { flexLabelStyles, Input, InputVariant } from '@voiceflow/ui';

import { styled, units } from '@/hocs';

const TitleInput = styled(Input).attrs({ variant: InputVariant.INLINE })`
  ${flexLabelStyles}
  flex: 1;
  width: 100%;
  margin-right: ${units(2)}px;
  color: #132144;
  font-weight: 600;
  font-size: 22px;
  -webkit-text-fill-color: #132144;
`;

export default TitleInput;
