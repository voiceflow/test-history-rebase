import { globalStyle, style } from '@voiceflow/style';

export const collapseContainerStyle = style({});

globalStyle(`${collapseContainerStyle} > div`, {
  position: 'sticky',
  top: 0,
  backgroundColor: 'white',
  zIndex: 2,
});

export const nestedCollapseContainerStyle = style({});

globalStyle(`${nestedCollapseContainerStyle} > div`, {
  position: 'sticky',
  top: 42,
  backgroundColor: 'white',
  zIndex: 1,
});
