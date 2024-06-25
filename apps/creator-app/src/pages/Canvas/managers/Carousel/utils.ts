import type * as Realtime from '@voiceflow/realtime-sdk';

import { buttonFactory } from './Editor/Buttons/constants';

export const cloneCard = (initVal: Realtime.NodeData.Carousel.Card, targetVal: Realtime.NodeData.Carousel.Card) => ({
  ...targetVal,
  id: initVal.id,
  buttons: targetVal.buttons.map(({ id, ...button }) => ({
    ...buttonFactory(),
    ...button,
  })),
});
