import { Dropdown, IconButton, IconButtonVariant, preventDefault, stopImmediatePropagation, Text } from '@voiceflow/ui';
import React from 'react';

import Drawer from '@/components/Drawer';
import * as Thread from '@/ducks/thread';
import { useSelector, useTheme } from '@/hooks';
import { Thread as ThreadType } from '@/models';
import { EditorContentAnimation } from '@/pages/Canvas/components/Editor';
import { useCommentingMode } from '@/pages/Project/hooks';
import { Identifier } from '@/styles/constants';
import { SlideOutDirection } from '@/styles/transitions/SlideOut';

import { Container as HeaderContainer, FilterMenu, NoThreads, ThreadItem } from './components';
import { FilterType } from './constants';

export interface ThreadHistoryDrawerProps {
  focusedTarget?: string | null;
}

export const ThreadHistoryDrawer: React.FC<ThreadHistoryDrawerProps> = () => {
  const theme = useTheme();
  const [filter, updateFilter] = React.useState<FilterType>(FilterType.OPEN);
  const openThreads = useSelector(Thread.openThreads);

  const resolvedThreads = useSelector(Thread.resolvedThreads);
  const threads = filter === FilterType.RESOLVED ? resolvedThreads : openThreads;
  const isCommentingMode = useCommentingMode();

  return (
    <Drawer
      id={Identifier.THREAD_HISTORY_DRAWER}
      scrollable
      width={theme.components.historyDrawer.width}
      open={isCommentingMode}
      direction={SlideOutDirection.LEFT}
      onPaste={stopImmediatePropagation()}
    >
      <HeaderContainer>
        <Text fontSize={18} fontWeight={600}>
          Threads
        </Text>

        <Dropdown
          menu={(onToggle) => (
            <FilterMenu
              filter={filter}
              setFilter={(filter: FilterType) => {
                updateFilter(filter);
                onToggle();
              }}
            />
          )}
        >
          {(ref, onToggle, isOpen) => (
            <IconButton
              ref={ref}
              size={16}
              icon="filter"
              active={isOpen}
              variant={IconButtonVariant.SUBTLE}
              onClick={preventDefault(onToggle)}
              iconProps={{ color: '#becedc' }}
              hoverColor={isOpen ? '#132144' : '#6e849a'}
            />
          )}
        </Dropdown>
      </HeaderContainer>
      {threads.length ? (
        <EditorContentAnimation>
          {threads.map((thread: ThreadType, idx: number) => (
            <ThreadItem key={idx} {...thread} />
          ))}
        </EditorContentAnimation>
      ) : (
        <NoThreads type={filter} />
      )}
    </Drawer>
  );
};

export default ThreadHistoryDrawer as React.FC<ThreadHistoryDrawerProps>;
