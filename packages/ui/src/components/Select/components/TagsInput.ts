import AutosizeInput from 'react-input-autosize';

import { css, styled } from '../../../styles';

const TagsInput = styled(AutosizeInput)<{ hasTags: boolean }>`
  border: none;
  display: inline-flex;

  input {
    border: none;
    height: 18px;
    padding: 4px;

    ${({ hasTags }) =>
      hasTags &&
      css`
        position: relative;
        top: 3px;
      `}
  }
`;

export default TagsInput;
