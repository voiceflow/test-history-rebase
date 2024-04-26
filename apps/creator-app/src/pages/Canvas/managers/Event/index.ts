import type * as Realtime from '@voiceflow/realtime-sdk';

import type { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import EventEditor from './EventEditor';
import EventStep from './EventStep';

const EventManager: NodeManagerConfig<Realtime.NodeData.Event, Realtime.NodeData.EventBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Custom',

  step: EventStep,
  editor: EventEditor,

  tooltipText: 'Receive events from Alexa in Voiceflow.',
};

export default EventManager;
