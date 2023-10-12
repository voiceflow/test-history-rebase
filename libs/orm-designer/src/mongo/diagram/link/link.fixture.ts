import type { Link } from './link.dto';
import { LinkType } from './link-type.enum';

export const link: Link = {
  nodeID: 'node-1',
  type: LinkType.CURVED,
  color: '#000',
  caption: {
    text: 'hello world',
    width: 100,
    height: 200,
  },
  points: [
    {
      point: [100, 200],
    },
  ],
};
