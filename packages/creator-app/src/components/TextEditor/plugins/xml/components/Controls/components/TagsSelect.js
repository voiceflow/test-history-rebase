import { SearchInput, Select } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const TagsSelect = styled(Select)`
  ${SearchInput} {
    color: #62778c;
    font-weight: 600;
    font-size: 13px;
    line-height: 15px;
    text-transform: uppercase;
  }
`;

export default TagsSelect;
