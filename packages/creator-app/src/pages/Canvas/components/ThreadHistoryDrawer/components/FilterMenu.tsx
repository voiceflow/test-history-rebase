import { Menu } from '@voiceflow/ui';
import React from 'react';

import * as Thread from '@/ducks/thread';
import * as UI from '@/ducks/ui';
import { useDispatch, useSelector } from '@/hooks';
import { FILTER_LABELS, FilterType } from '@/pages/Canvas/components/ThreadHistoryDrawer/constants';
import MenuCheckboxOption, { CheckboxType } from '@/pages/Canvas/managers/components/MenuCheckboxOption';

interface FilterMenuProps {
  filter: FilterType;
  setFilter: (type: FilterType) => void;
}

const FilterMenu: React.FC<FilterMenuProps> = ({ setFilter, filter }) => {
  const commentsVisible = useSelector(UI.isCommentsVisible);
  const toggleCommentVisibility = useDispatch(UI.toggleCommentVisibility);
  const openThreads = useSelector(Thread.openThreads);

  const resolvedThreads = useSelector(Thread.resolvedThreads);
  return (
    <Menu<undefined>
      noBottomPadding
      width={250}
      options={[
        {
          note: openThreads.length ? `${openThreads.length}` : undefined,
          label: FILTER_LABELS[FilterType.OPEN],
          active: filter === FilterType.OPEN,
          onClick: () => setFilter(FilterType.OPEN),
        },
        {
          note: resolvedThreads.length ? `${resolvedThreads.length}` : undefined,
          label: FILTER_LABELS[FilterType.RESOLVED],
          active: filter === FilterType.RESOLVED,
          onClick: () => setFilter(FilterType.RESOLVED),
        },
        {
          style: { marginBottom: 0 },
          label: '',
          divider: true,
        },
        {
          label: (
            <MenuCheckboxOption type={CheckboxType.CHECKBOX} checked={!commentsVisible}>
              Hide Comments
            </MenuCheckboxOption>
          ),
          note: '⇧C',
          ending: true,
          onClick: toggleCommentVisibility,
        },
      ]}
    />
  );
};

export default FilterMenu;
