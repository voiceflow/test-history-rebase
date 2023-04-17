import * as Realtime from '@voiceflow/realtime-sdk';
import { serializeToText } from '@voiceflow/slate-serializer/text';

import * as Documentation from '@/config/documentation';

import { NodeManagerConfigV2 } from '../types';
import { NODE_CONFIG } from './constants';
import Editor from './Editor';
import CarouselStep from './Step';

const CarouselManager: NodeManagerConfigV2<Realtime.NodeData.Carousel, Realtime.NodeData.CarouselBuiltInPorts> = {
  ...NODE_CONFIG,
  label: 'Carousel',

  step: CarouselStep,
  editorV2: Editor,

  getSearchParams: (node) => node.cards.flatMap(({ title, description }) => [title, serializeToText(description)]),

  tooltipText: 'Displays a selection of multi-modal cards.',
  tooltipLink: Documentation.CAROUSEL_STEP,
};

export default CarouselManager;
