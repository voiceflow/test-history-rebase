import { inputStyle } from '@/components/Input/styles';
import { styled, units } from '@/hocs';

const InlineInputValue = styled.div`
  ${inputStyle}
  display: inline-block;
  padding-left: 16px;
  padding-right: ${units(4.5)}px;
  width: auto;
  visibility: hidden;
  position: absolute;
  bottom: 0;
  left: -100%;
`;

export default InlineInputValue;
