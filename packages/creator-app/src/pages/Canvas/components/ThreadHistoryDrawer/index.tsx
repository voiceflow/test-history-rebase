import { Utils } from '@voiceflow/common';
import { Dropdown, IconButton, IconButtonVariant, preventDefault, stopImmediatePropagation, Text } from '@voiceflow/ui';
import React from 'react';
import { matchPath, useHistory } from 'react-router-dom';

import CustomScrollbars, { Scrollbars } from '@/components/CustomScrollbars';
import Drawer from '@/components/Drawer';
import { Path } from '@/config/routes';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as Thread from '@/ducks/thread';
import { useRAF, useSelector, useTheme } from '@/hooks';
import { Thread as ThreadType } from '@/models';
import { EditorContentAnimation } from '@/pages/Canvas/components/Editor';
import { FocusThreadContext } from '@/pages/Canvas/contexts';
import { useCanvasRendered } from '@/pages/Canvas/hooks';
import { useCommentingMode } from '@/pages/Project/hooks';
import { Identifier } from '@/styles/constants';

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

  const scrollbarsRef = React.useRef<Scrollbars>(null);
  const [filter, updateFilter] = React.useState<FilterType>(FilterType.OPEN);

  const threads = useSelector((state) => (filter === FilterType.RESOLVED ? Thread.resolvedThreads(state) : Thread.openedThreads(state)));
  const activeDiagramID = useSelector(CreatorV2.activeDiagramIDSelector);

  React.useEffect(() => {
    const match = matchPath<{ threadID: string; commentID?: string }>(history.location.pathname, { path: Path.CANVAS_COMMENTING_THREAD });

    if (canvasRendered && match && match.params.threadID) {
      focusScheduler(() => {
        focusThreadApi?.setFocus(match.params.threadID, { center: true, commentID: match.params.commentID });
      });
    }
  }, [canvasRendered, activeDiagramID]);

  return (
    <Drawer
      id={Identifier.THREAD_HISTORY_DRAWER}
      open={isCommentingMode}
      width={theme.components.historyDrawer.width}
      style={{ display: 'flex', flexDirection: 'column' }}
      onPaste={stopImmediatePropagation()}
      direction={Drawer.Direction.LEFT}
    >
      <HeaderContainer>
        <Text fontSize={18} fontWeight={600}>
          Threads
        </Text>

        <Dropdown menu={(onToggle) => <FilterMenu filter={filter} setFilter={Utils.functional.chain(updateFilter, onToggle)} />}>
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

      <ScrollbarsContainer>
        <CustomScrollbars ref={scrollbarsRef}>
          {threads.length ? (
            <EditorContentAnimation>
              {threads.map((thread: ThreadType, idx: number) => (
                <ThreadItem key={idx} {...thread} />
              ))}
            </EditorContentAnimation>
          ) : (
            <NoThreads type={filter} />
          )}
        </CustomScrollbars>
      </ScrollbarsContainer>
    </Drawer>
  );
};

export default ThreadHistoryDrawer;
