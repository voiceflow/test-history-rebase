import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfigV2 } from '../types';
import { NODE_CONFIG } from './constants';
import Editor from './Editor';
import CarouselStep from './Step';

const CarouselManager: NodeManagerConfigV2<Realtime.NodeData.Carousel, Realtime.NodeData.CarouselBuiltInPorts> = {
  ...NODE_CONFIG,
  label: 'Carousel',

  step: CarouselStep,
  editorV2: Editor,
};

export default CarouselManager;
