import { story } from '@/postgres/story/story.fixture';

import { NodeType } from '../../node/node-type.enum';
import { nextPort } from '../../port/port.fixture';
import { PortType } from '../../port/port-type.enum';
import type { GoToStoryAction } from './go-to-story.action';

export const goToStoryAction: GoToStoryAction = {
  id: 'go-to-story-action-1',
  parentID: 'actions-1',
  type: NodeType.ACTION__GO_TO_STORY__V3,

  data: {
    storyID: story.id,
  } as any,

  ports: {
    [PortType.NEXT]: nextPort,
  },
};
