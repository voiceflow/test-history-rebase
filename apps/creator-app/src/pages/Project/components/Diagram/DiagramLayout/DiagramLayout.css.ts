import { style } from '@voiceflow/style';

import { CANVAS_COLOR } from '@/constants/canvas';

export const containerStyle = style({
  overflow: ['hidden', 'clip'],
  width: '100vw',
  height: '100%',
  position: 'relative',
  backgroundColor: CANVAS_COLOR,
});
