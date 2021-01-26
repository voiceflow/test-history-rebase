import { SearchableListItemContainer } from '@/components/SearchableList';
import { styled } from '@/hocs';

const DeviceItem = styled(SearchableListItemContainer)`
  height: 42px;
  padding: 12px 32px;
  font-size: 13px;

  & * {
    z-index: 1;
  }

  &:before {
    z-index: 0;
  }
`;

export default DeviceItem;
