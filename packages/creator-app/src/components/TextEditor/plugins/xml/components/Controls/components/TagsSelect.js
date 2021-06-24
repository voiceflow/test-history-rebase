import { SearchInput, Select } from '@voiceflow/ui';

import { styled } from '@/hocs';

const TagsSelect = styled(Select)`
  width: 126px;

  ${SearchInput} {
    color: #62778c;
    font-weight: 600;
    font-size: 13px;
    line-height: 15px;
    text-transform: uppercase;
  }
`;

export default TagsSelect;
