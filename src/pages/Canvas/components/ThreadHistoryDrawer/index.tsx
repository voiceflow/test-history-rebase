/* eslint-disable no-nested-ternary */
import React from 'react';
import { withTheme } from 'styled-components';

import Drawer from '@/components/Drawer';
import DropdownWithCaret from '@/components/DropdownWithCaret';
import BaseMenu, { MenuItem } from '@/components/Menu';
import Text from '@/components/Text';
import * as Thread from '@/ducks/thread';
import { connect } from '@/hocs';
import { Thread as ThreadType } from '@/models';
import { EditorContentAnimation } from '@/pages/Canvas/components/Editor';
import { useCommentingMode } from '@/pages/Skill/hooks';
import { Identifier } from '@/styles/constants';
import { Theme } from '@/styles/theme';
import { SlideOutDirection } from '@/styles/transitions/SlideOut.ts';
import { ConnectedProps } from '@/types';
import { stopImmediatePropagation } from '@/utils/dom';
import { compose } from '@/utils/functional';

import { Container as HeaderContainer, NoThreads, ThreadItem } from './components';
import { FILTER_LABELS, FilterType } from './constants';

const Menu: any = BaseMenu;

export type ThreadHistoryDrawerProps = {
  theme: Theme;
  focusedTarget?: string | null;
};

export const ThreadHistoryDrawer: React.FC<ThreadHistoryDrawerProps & ConnectedThreadHistoryDrawerProps> = ({
  openThreads,
  resolvedThreads,
  theme,
}) => {
  const [filter, updateFilter] = React.useState<FilterType>(FilterType.OPEN);
  const threads = filter === FilterType.RESOLVED ? resolvedThreads : openThreads;
  const label = FILTER_LABELS[filter];
  const dropdownText = threads.length ? `${threads.length} ${label}` : label;

  const isCommentingMode = useCommentingMode();

  const onClick = React.useCallback((type: FilterType) => () => updateFilter(type), [resolvedThreads, openThreads]);

  return (
    <Drawer
      id={Identifier.THREAD_HISTORY_DRAWER}
      width={theme.components.historyDrawer.width}
      open={isCommentingMode}
      onPaste={stopImmediatePropagation()}
      direction={SlideOutDirection.LEFT}
      scrollable
    >
      <HeaderContainer>
        <Text fontSize={18} fontWeight={600}>
          Threads
        </Text>
        <DropdownWithCaret
          placement="bottom-end"
          padding="10px 0px"
          text={dropdownText}
          color="#62778c"
          menu={
            <Menu fullWidth>
              <MenuItem onClick={onClick(FilterType.OPEN)}>{FILTER_LABELS[FilterType.OPEN]}</MenuItem>
              <MenuItem onClick={onClick(FilterType.RESOLVED)}>{FILTER_LABELS[FilterType.RESOLVED]}</MenuItem>
            </Menu>
          }
        />
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

const mapStateToProps = {
  openThreads: Thread.openThreads,
  resolvedThreads: Thread.resolvedThreads,
};

export type ConnectedThreadHistoryDrawerProps = ConnectedProps<typeof mapStateToProps>;

export default compose(connect(mapStateToProps), withTheme, React.memo)(ThreadHistoryDrawer as any) as React.FC<
  Omit<ThreadHistoryDrawerProps, 'theme'>
>;
