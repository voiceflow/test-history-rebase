import React from 'react';

import Box from '@/components/Box';
import THEME from '@/styles/theme';

import { ThreadHistoryDrawer } from '.';

const OPEN_THREADS = [
  {
    id: 'threadID',
    projectID: 'projectID',
    diagramID: ' diagramID',
    nodeID: 'nodeID',
    position: [200, 200],
    creatorID: 2,
    resolved: false,
    comments: [{ id: 'commentID', threadID: 'threadID', created: '', text: 'this is a comment', mentions: [], creatorID: 2 }],
  },
  {
    id: 'threadID2',
    projectID: 'projectID',
    diagramID: ' diagramID',
    nodeID: 'nodeID2',
    position: [300, 200],
    creatorID: 3,
    resolved: false,
    comments: [{ id: 'commentID', threadID: 'threadID2', created: '', text: 'this is a another comment', mentions: [], creatorID: 3 }],
  },
];

const RESOLVED_THREADS = [
  {
    id: 'threadID3',
    projectID: 'projectID',
    diagramID: ' diagramID',
    nodeID: 'nodeID',
    position: [200, 200],
    creatorID: 5,
    resolved: true,
    comments: [{ id: 'commentID', threadID: 'threadID3', created: '', text: 'this is a comment', mentions: [], creatorID: 5 }],
  },
  {
    id: 'threadID4',
    projectID: 'projectID',
    diagramID: ' diagramID',
    nodeID: 'nodeID2',
    position: [300, 200],
    creatorID: 6,
    resolved: true,
    comments: [{ id: 'commentID', threadID: 'threadID4', created: '', text: 'this is a another comment', mentions: [], creatorID: 6 }],
  },
];

export const getProps: any = () => ({ theme: THEME });

export default {
  title: 'Thread History Drawer',
  component: ThreadHistoryDrawer,
};

export const noThreads = () => (
  <Box m={30}>
    <ThreadHistoryDrawer {...getProps()} />
  </Box>
);

export const onlyOpenThreads = () => (
  <Box m={30}>
    <ThreadHistoryDrawer {...{ openThreads: OPEN_THREADS }} {...getProps()} />
  </Box>
);

export const onlyResolvedThreads = () => (
  <Box m={30}>
    <ThreadHistoryDrawer {...{ resolvedThreads: RESOLVED_THREADS }} {...getProps()} />
  </Box>
);

export const allThreads = () => (
  <Box m={30}>
    <ThreadHistoryDrawer {...{ openThreads: OPEN_THREADS, resolvedThreads: RESOLVED_THREADS }} {...getProps()} />
  </Box>
);
