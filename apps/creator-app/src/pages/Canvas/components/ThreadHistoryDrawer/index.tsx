import { Utils } from '@voiceflow/common';
import {
  CustomScrollbars,
  CustomScrollbarsTypes,
  Dropdown,
  preventDefault,
  stopImmediatePropagation,
  System,
  Text,
  useOnScreen,
  useToggle,
} from '@voiceflow/ui';
import React from 'react';
import { useHistory } from 'react-router-dom';

import Drawer from '@/components/Drawer';
import { Path } from '@/config/routes';
import { Designer } from '@/ducks';
import * as CreatorV2 from '@/ducks/creatorV2';
import { useRAF, useSelector, useTheme } from '@/hooks';
import { EditorContentAnimation } from '@/pages/Canvas/components/Editor';
import { FocusThreadContext } from '@/pages/Canvas/contexts';
import { useCanvasRendered } from '@/pages/Canvas/hooks/canvas';
import { useCommentingMode } from '@/pages/Project/hooks';
import { Identifier } from '@/styles/constants';
import { matchPath } from '@/utils/route.util';

import { Container as HeaderContainer, FilterMenu, NoThreads, ScrollbarsContainer, ThreadItem } from './components';
import { FilterType } from './constants';

export interface ThreadHistoryDrawerProps {
  focusedTarget?: string | null;
}

export const ThreadHistoryDrawer: React.FC<ThreadHistoryDrawerProps> = () => {
  const theme = useTheme();
  const history = useHistory();
  const canvasRendered = useCanvasRendered();
  const focusThreadApi = React.useContext(FocusThreadContext);
  const isCommentingMode = useCommentingMode();
  const [focusScheduler] = useRAF();

  const scrollbarsRef = React.useRef<CustomScrollbarsTypes.Scrollbars>(null);
  const [filter, updateFilter] = React.useState<FilterType>(FilterType.OPEN);

  const threads = useSelector((state) =>
    filter === FilterType.RESOLVED ? Designer.Thread.selectors.allResolved(state) : Designer.Thread.selectors.allOpened(state)
  );
  const activeDiagramID = useSelector(CreatorV2.activeDiagramIDSelector);

  const visibilityNodeRef = React.useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreen(visibilityNodeRef);
  const [isFirstThreadFocused, toggleFocusedThread] = useToggle(false);

  React.useEffect(() => {
    const match = matchPath(history.location.pathname, [Path.CANVAS_COMMENTING_THREAD, Path.DOMAIN_CANVAS_COMMENTING_THREAD]);

    if (canvasRendered && match && match.params.threadID) {
      focusScheduler(() => {
        focusThreadApi?.setFocus(match.params.threadID, { center: true, commentID: match.params.commentID });
      });
    }
  }, [canvasRendered, activeDiagramID]);

  React.useEffect(() => {
    if (!threads.length) return;

    const firstThreadId = threads[0].id;
    if (
      (!isFirstThreadFocused && focusThreadApi?.focusedID === firstThreadId) ||
      (isFirstThreadFocused && focusThreadApi?.focusedID !== firstThreadId)
    ) {
      toggleFocusedThread();
    }
  }, [focusThreadApi?.focusedID, threads]);

  return (
    <Drawer
      id={Identifier.THREAD_HISTORY_DRAWER}
      open={isCommentingMode}
      width={theme.components.historyDrawer.width}
      style={{ display: 'flex', flexDirection: 'column' }}
      onPaste={stopImmediatePropagation()}
      direction={Drawer.Direction.LEFT}
    >
      <HeaderContainer borderColor={!isOnScreen || isFirstThreadFocused ? '#dfe3ed' : '#eaeff4'}>
        <Text fontSize={18} fontWeight={600}>
          Threads
        </Text>

        {isCommentingMode && (
          <Dropdown menu={(onToggle) => <FilterMenu filter={filter} setFilter={Utils.functional.chain(updateFilter, onToggle)} />}>
            {({ ref, onToggle, isOpen }) => (
              <System.IconButtonsGroup.Base>
                <System.IconButton.Base ref={ref} icon="filter" active={isOpen} onClick={preventDefault(onToggle)} />
              </System.IconButtonsGroup.Base>
            )}
          </Dropdown>
        )}
      </HeaderContainer>

      <ScrollbarsContainer>
        <CustomScrollbars ref={scrollbarsRef}>
          {threads.length ? (
            <EditorContentAnimation>
              <div ref={visibilityNodeRef} />
              {threads.map((thread) => (
                <ThreadItem key={thread.id} thread={thread} />
              ))}
            </EditorContentAnimation>
          ) : (
            <>
              <div ref={visibilityNodeRef} />
              <NoThreads type={filter} />
            </>
          )}
        </CustomScrollbars>
      </ScrollbarsContainer>
    </Drawer>
  );
};

export default ThreadHistoryDrawer;
