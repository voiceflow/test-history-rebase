import { globalStyle, style } from '@voiceflow/style';

export const markdownStyle = style({});

globalStyle(`${markdownStyle} ul, ${markdownStyle} ol`, {
  paddingInlineStart: 16,
});
