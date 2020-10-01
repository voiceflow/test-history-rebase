import { inputStyle } from '@/components/Input/styles';
import { styled } from '@/hocs';

const InlineInputValue = styled.div`
  ${inputStyle}
  display: inline-block;
  padding-left: 16px;
  padding-right: 42px;
  width: auto;
  visibility: hidden;
  position: absolute;
  bottom: 0;
  left: -100%;
`;

export default InlineInputValue;
