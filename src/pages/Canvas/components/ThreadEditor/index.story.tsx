import React from 'react';

import Box from '@/components/Box';

import ThreadEditor from '.';

const THREAD = {
  id: 'threadID',
  projectID: 'projectID',
  diagramID: ' diagramID',
  nodeID: 'nodeID',
  position: [200, 200],
  creatorID: 2,
  resolved: false,
  comments: [{ id: 'commentID', threadID: 'threadID', created: '', text: 'this is a comment', mentions: [], creatorID: 2 }],
};

const getProps: any = () => ({
  thread: THREAD,
});

export default {
  title: 'Thread Editor',
  component: ThreadEditor,
};

export const normal = () => (
  <Box m={30}>
    <ThreadEditor {...getProps()} />
  </Box>
);
