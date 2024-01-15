import { style } from '@voiceflow/style';
import { Theme } from '@voiceflow/ui-next/styles';

export const editorStyles = style({
  width: '100%',
  color: Theme.vars.color.font.default,
});

export const focusModifier = style({
  height: '21px',
});

export const mapperModifier = style({
  marginTop: '-3px',
});

export const mapperInputStyles = style({
  width: '143px',
  marginTop: '-3.5px',
  paddingLeft: 0,
  marginLeft: '-3px',
  overflow: 'hidden',
  lineHeight: '24px',
});

export const inputVariableContainerModifier = style({
  padding: 0,
  marginLeft: 0,
});

export const stickyRunButtonWrapper = style({
  position: 'absolute',
  bottom: '0px',
  left: '0px',
  width: '100%',
  padding: '8px 12px 12px 12px',
  backgroundColor: 'white',
});
