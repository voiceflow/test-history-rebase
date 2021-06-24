import { styled } from '../../../styles';
import { inputStyle } from '../../Input';

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
