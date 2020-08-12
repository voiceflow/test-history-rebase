import { NodeData } from '@/models';

import { createBlockAdapter } from './utils';

const speakAdapter = createBlockAdapter<NodeData.Speak, NodeData.Speak>(
  ({ randomize, dialogs }) => ({ randomize, dialogs }),
  ({ randomize, dialogs }) => ({
    randomize,
    dialogs: dialogs.map(({ content, type, url, voice }) => ({
      content,
      type,
      url,
      voice,
    })),
  })
);

export default speakAdapter;
