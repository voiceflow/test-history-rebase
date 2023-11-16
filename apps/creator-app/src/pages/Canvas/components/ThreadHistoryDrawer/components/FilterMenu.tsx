import { Checkbox, Menu } from '@voiceflow/ui';
import React from 'react';

import { Designer } from '@/ducks';
import * as UI from '@/ducks/ui';
import { useDispatch, useSelector } from '@/hooks';
import { FILTER_LABELS, FilterType } from '@/pages/Canvas/components/ThreadHistoryDrawer/constants';
import MenuCheckboxOption from '@/pages/Canvas/managers/components/MenuCheckboxOption';

interface FilterMenuProps {
  filter: FilterType;
  setFilter: (type: FilterType) => void;
}

const FilterMenu: React.FC<FilterMenuProps> = ({ setFilter, filter }) => {
  const commentsVisible = useSelector(UI.isCommentsVisible);
  const openThreadsCount = useSelector(Designer.Thread.selectors.allOpenedCount);
  const isTopicThreadsOnly = useSelector(UI.isTopicThreadsOnly);
  const isDomainThreadsOnly = useSelector(UI.isDomainThreadsOnly);
  const resolvedThreadsCount = useSelector(Designer.Thread.selectors.allResolvedCount);
  const isMentionedThreadsOnly = useSelector(UI.isMentionedThreadsOnly);

  const toggleTopicThreadsOnly = useDispatch(UI.toggleTopicThreadsOnly);
  const toggleDomainThreadsOnly = useDispatch(UI.toggleDomainThreadsOnly);
  const toggleCommentVisibility = useDispatch(UI.toggleCommentVisibility);
  const toggleMentionedThreadsOnly = useDispatch(UI.toggleMentionedThreadsOnly);

  return (
    <Menu
      noBottomPadding
      width={250}
      options={[
        {
          note: openThreadsCount ? `${openThreadsCount}` : undefined,
          label: <MenuCheckboxOption checked={filter === FilterType.OPEN}>{FILTER_LABELS[FilterType.OPEN]}</MenuCheckboxOption>,
          onClick: () => setFilter(FilterType.OPEN),
        },
        {
          note: resolvedThreadsCount ? `${resolvedThreadsCount}` : undefined,
          label: <MenuCheckboxOption checked={filter === FilterType.RESOLVED}>{FILTER_LABELS[FilterType.RESOLVED]}</MenuCheckboxOption>,
          onClick: () => setFilter(FilterType.RESOLVED),
        },

        { label: '', divider: true },
        {
          label: (
            <MenuCheckboxOption type={Checkbox.Type.CHECKBOX} checked={isMentionedThreadsOnly}>
              Only tagged threads
            </MenuCheckboxOption>
          ),
          onClick: toggleMentionedThreadsOnly,
        },
        {
          label: (
            <MenuCheckboxOption type={Checkbox.Type.CHECKBOX} checked={isTopicThreadsOnly}>
              Only current topic
            </MenuCheckboxOption>
          ),
          onClick: toggleTopicThreadsOnly,
        },
        {
          label: (
            <MenuCheckboxOption type={Checkbox.Type.CHECKBOX} checked={isDomainThreadsOnly}>
              Only current domain
            </MenuCheckboxOption>
          ),
          onClick: toggleDomainThreadsOnly,
        },
        { style: { marginBottom: 0 }, label: '', divider: true },
        {
          label: (
            <MenuCheckboxOption type={Checkbox.Type.CHECKBOX} checked={!commentsVisible}>
              Hide comments
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
