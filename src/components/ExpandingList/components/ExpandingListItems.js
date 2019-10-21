import List from '@/components/List';
import { styled, transition, units } from '@/hocs';

import ExpandingListItem from './ExpandingListItem';

const ExpandingListItems = styled(List)`
  ${transition('max-height')}


  & > ${ExpandingListItem} {
    padding: ${units(0.5)}px 0;
  }
`;

export default ExpandingListItems;
