import { globalStyle, style } from '@voiceflow/style';
import { Tokens } from '@voiceflow/ui-next/styles';

export const responseEditorElement = style({
  width: '100%',
});

export const wrapper = style({ position: 'relative', width: '100%' });

export const responseEditorContainer = style({
  width: '100%',
  display: 'block',
  flexDirection: 'column',
  position: 'relative',
});

export const dragButtonModifier = style({
  marginLeft: '6px',
  transition: Tokens.transition(['opacity']),
  position: 'absolute',
  top: '33px',
  zIndex: 4,
  opacity: 0,
});

export const slateModifierStyle = style({
  padding: '0 22px',
  margin: '0 22px',
});

globalStyle(`${wrapper}:hover > ${dragButtonModifier}`, {
  opacity: 1,
});

globalStyle(`${wrapper}:has(${responseEditorElement}:hover) > ${dragButtonModifier}`, {
  opacity: 0,
});

globalStyle(`${wrapper}:has(${slateModifierStyle}:hover) > ${dragButtonModifier}`, {
  opacity: 0,
});
