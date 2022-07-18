import * as Realtime from '@voiceflow/realtime-sdk';
import { SVG } from '@voiceflow/ui';

import { RESPONSE_STEPS_LINK } from '@/constants';

import { NodeManagerConfigV2 } from '../types';
import { NODE_CONFIG } from './constants';
import Editor from './Editor';
import CarouselStep from './Step';

const CarouselManager: NodeManagerConfigV2<Realtime.NodeData.Carousel, Realtime.NodeData.CarouselBuiltInPorts> = {
  ...NODE_CONFIG,
  label: 'Carousel',

  step: CarouselStep,
  editorV2: Editor,

  stepsMenuIcon: SVG.systemCarousel,
  tooltipText: 'Displays a selection of multi-modal cards.',
  tooltipLink: RESPONSE_STEPS_LINK,
};

export default CarouselManager;
