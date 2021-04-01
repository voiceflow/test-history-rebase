import Input from '@/components/Input';
import { styled } from '@/hocs';

const StyledInput = styled(Input)`
  line-height: 22px;
  padding-top: 9px;
  padding-bottom: 9px;

  /* Needed to prevent overflow of variable names in Draft.js editor in Set and If blcoks */
  .public-DraftEditor-content {
    overflow-x: scroll;
    overflow-y: hidden;
  }
`;

// eslint-disable-next-line import/prefer-default-export
export { StyledInput as Input };
