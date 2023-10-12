import { NodeType } from '../../node/node-type.enum';
import { nextPort } from '../../port/port.fixture';
import { PortType } from '../../port/port-type.enum';
import type { OpenURLAction } from './open-url.action';
import { OpenURLTarget } from './open-url-target.enum';

export const openURLAction: OpenURLAction = {
  id: 'open-url-action-1',
  parentID: 'actions-1',
  type: NodeType.ACTION__OPEN_URL__V3,

  data: {
    url: ['http://example.com'],
    target: OpenURLTarget.NEW_TAB,
  } as any,

  ports: {
    [PortType.NEXT]: nextPort,
  },
};
