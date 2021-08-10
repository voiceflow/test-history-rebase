import { Hotkey, TextProperty } from '../constants';
import { createTextPropertyButton, createToggleTextPropertyButton } from './utils';

export const TextItalicButton = createToggleTextPropertyButton({ icon: 'italic', property: TextProperty.ITALIC, hotkey: Hotkey.ITALIC });

export const TextUnderlineButton = createToggleTextPropertyButton({ icon: 'underline', property: TextProperty.UNDERLINE, hotkey: Hotkey.UNDERLINE });

export const TextStrikeThroughButton = createToggleTextPropertyButton({
  icon: 'strikeThrough',
  hotkey: Hotkey.STRIKE_THROUGH,
  property: TextProperty.STRIKE_THROUGH,
});

export const TextBoldButton = createTextPropertyButton({
  icon: 'textBold',
  value: '700',
  hotkey: Hotkey.BOLD,
  property: TextProperty.FONT_WEIGHT,
  removable: true,
});
