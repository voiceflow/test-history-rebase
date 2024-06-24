import { Menu } from '@voiceflow/ui';
import React from 'react';

import Checkbox from '@/components/legacy/Checkbox';
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
  const commentsVisible = useSelector(UI.selectors.isCommentsVisible);
  const openThreadsCount = useSelector(Designer.Thread.selectors.allOpenedCount);
  const resolvedThreadsCount = useSelector(Designer.Thread.selectors.allResolvedCount);
  const isWorkflowThreadsOnly = useSelector(UI.selectors.isWorkflowThreadsOnly);
  const isMentionedThreadsOnly = useSelector(UI.selectors.isMentionedThreadsOnly);

  const toggleCommentVisibility = useDispatch(UI.action.ToggleCommentVisibility);
  const toggleWorkflowThreadsOnly = useDispatch(UI.action.ToggleWorkflowThreadsOnly);
  const toggleMentionedThreadsOnly = useDispatch(UI.action.ToggleMentionedThreadsOnly);

  return (
    <Menu
      width={250}
      noBottomPadding
      options={[
        {
          note: openThreadsCount ? `${openThreadsCount}` : undefined,
          label: (
            <MenuCheckboxOption checked={filter === FilterType.OPEN}>
              {FILTER_LABELS[FilterType.OPEN]}
            </MenuCheckboxOption>
          ),
          onClick: () => setFilter(FilterType.OPEN),
        },
        {
          note: resolvedThreadsCount ? `${resolvedThreadsCount}` : undefined,
          label: (
            <MenuCheckboxOption checked={filter === FilterType.RESOLVED}>
              {FILTER_LABELS[FilterType.RESOLVED]}
            </MenuCheckboxOption>
          ),
          onClick: () => setFilter(FilterType.RESOLVED),
        },

        { label: '', divider: true },
        {
          label: (
            <MenuCheckboxOption type={Checkbox.Type.CHECKBOX} checked={isMentionedThreadsOnly}>
              Only tagged threads
            </MenuCheckboxOption>
          ),
          onClick: () => toggleMentionedThreadsOnly(),
        },
        {
          label: (
            <MenuCheckboxOption type={Checkbox.Type.CHECKBOX} checked={isWorkflowThreadsOnly}>
              Only current workflow
            </MenuCheckboxOption>
          ),
          onClick: () => toggleWorkflowThreadsOnly(),
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
          onClick: () => toggleCommentVisibility(),
        },
      ]}
    />
  );
};

export default FilterMenu;
