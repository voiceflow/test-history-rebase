import { flexLabelStyles } from '@/components/Flex';
import Input, { InputVariant } from '@/components/Input';
import { styled, units } from '@/hocs';

const TitleInput = styled(Input).attrs({ variant: InputVariant.INLINE })`
  ${flexLabelStyles}
  font-size: 22px;
  font-weight: 600;
  color: #132144;
  width: 100%;
  flex: 1;
  margin-right: ${units(2)}px;
`;

export default TitleInput;
