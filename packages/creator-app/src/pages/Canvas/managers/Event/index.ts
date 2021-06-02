import { NodeData } from '@/models';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import EventEditor from './EventEditor';
import EventStep from './EventStep';

const EventManager: NodeManagerConfig<NodeData.Event> = {
  ...NODE_CONFIG,

  tip: 'Recieve special types of events from alexa',
  label: 'Event',

  step: EventStep,
  editor: EventEditor,
};

export default EventManager;
