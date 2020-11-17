import { BlockType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';
import EventEditor from './EventEditor';
import EventStep from './EventStep';

const EventManager: NodeConfig<NodeData.Event> = {
  type: BlockType.EVENT,
  icon: 'next',
  iconColor: '#5589eb',

  label: 'Event',
  tip: 'Recieve special types of events from alexa',

  step: EventStep,
  editor: EventEditor,

  mergeInitializer: true,

  factory: (factoryData?) => ({
    node: {
      ports: {
        out: [{}],
      },
    },
    data: {
      name: 'Event',
      requestName: '',
      mappings: [
        {
          path: '',
          var: '',
        },
      ],
      ...factoryData,
    },
  }),
};

export default EventManager;
