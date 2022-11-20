import * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';
import { serializeSlateToText } from '@/utils/slate';

import { NodeManagerConfigV2 } from '../types';
import { NODE_CONFIG } from './constants';
import Editor from './Editor';
import CarouselStep from './Step';

const CarouselManager: NodeManagerConfigV2<Realtime.NodeData.Carousel, Realtime.NodeData.CarouselBuiltInPorts> = {
  ...NODE_CONFIG,
  label: 'Carousel',

  step: CarouselStep,
  editorV2: Editor,

  getSearchParams: (node) => node.cards.flatMap(({ title, description }) => [title, serializeSlateToText(description)]),

  tooltipText: 'Displays a selection of multi-modal cards.',
  tooltipLink: Documentation.CAROUSEL_STEP,
};

export default CarouselManager;
