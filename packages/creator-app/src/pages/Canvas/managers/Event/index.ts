import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import EventEditor from './EventEditor';
import EventStep from './EventStep';

const EventManager: NodeManagerConfig<Realtime.NodeData.Event, Realtime.NodeData.EventBuiltInPorts> = {
  ...NODE_CONFIG,

  tip: 'Recieve special types of events from alexa',
  label: 'Event',

  step: EventStep,
  editor: EventEditor,
};

export default EventManager;
