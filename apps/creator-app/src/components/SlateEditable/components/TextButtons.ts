import { Hotkey, TextProperty } from '../constants';
import { createTextPropertyButton, createToggleTextPropertyButton } from './utils';

export const TextItalicButton = createToggleTextPropertyButton({
  icon: 'systemItalic',
  property: TextProperty.ITALIC,
  hotkey: Hotkey.ITALIC,
});

export const TextUnderlineButton = createToggleTextPropertyButton({
  icon: 'systemUnderscore',
  property: TextProperty.UNDERLINE,
  hotkey: Hotkey.UNDERLINE,
});

export const TextStrikeThroughButton = createToggleTextPropertyButton({
  icon: 'systemStrikeThrough',
  hotkey: Hotkey.STRIKE_THROUGH,
  property: TextProperty.STRIKE_THROUGH,
});

export const TextBoldButton = createTextPropertyButton({
  icon: 'systemBold',
  value: '700',
  hotkey: Hotkey.BOLD,
  property: TextProperty.FONT_WEIGHT,
  removable: true,
});
