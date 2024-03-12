import { style } from '@voiceflow/style';

export const textareaStyles = style({
  minHeight: '104px',
  width: '100%',
  overflowY: 'auto',
  overflowX: 'hidden',
  // TODO: will be replaced by a component that calculates this (DX-709)
  maxHeight: 'calc(100vh - (32px * 2) - 116px - 20px - 20px - 80px - 20px )',
});

export const dropdownPrefixIconModifier = style({
  left: '9px',
  height: '100%',
  top: '0px',
});

export const dropdownModifier = style({
  paddingLeft: '37px',
});
