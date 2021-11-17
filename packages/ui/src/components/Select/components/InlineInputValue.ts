import { inputStyle } from '@ui/components/Input';
import { styled } from '@ui/styles';

const InlineInputValue = styled.div`
  ${inputStyle}
  position: absolute;
  bottom: 0;
  left: -100%;
  display: inline-block;
  width: auto;
  padding-right: 34px;
  padding-left: 16px;
  visibility: hidden;
`;

export default InlineInputValue;
