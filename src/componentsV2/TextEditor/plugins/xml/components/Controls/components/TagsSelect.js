import Select from '@/componentsV2/Select';
import { SearchInput } from '@/componentsV2/Select/components';
import { styled } from '@/hocs';

const TagsSelect = styled(Select)`
  width: 128px;

  ${SearchInput} {
    font-size: 13px;
    font-weight: 600;
    line-height: 15px;
    text-transform: uppercase;

    color: #62778c;
  }
`;

export default TagsSelect;
