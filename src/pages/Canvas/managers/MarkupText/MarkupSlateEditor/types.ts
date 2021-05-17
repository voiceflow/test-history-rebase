import { BaseEditor, BaseElement, BaseText } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';

import { Markup } from '@/models';

import type { ElementProperty, ElementType, FAKE_SELECTION_PROPERTY_NAME, Font, FontWeight, TextAlign, TextProperty } from '../constants';
import type { FakeSelectionEditor } from './fakeSelectionPlugin';

export interface Element extends BaseElement {
  type?: ElementType;
  [ElementProperty.TEXT_ALIGN]?: TextAlign;
}

export interface LinkElement extends Element {
  type: ElementType;
  url?: string;
}

export interface Text extends BaseText {
  [FAKE_SELECTION_PROPERTY_NAME]?: boolean;

  [TextProperty.COLOR]?: Markup.Color;
  [TextProperty.ITALIC]?: boolean;
  [TextProperty.UNDERLINE]?: boolean;
  [TextProperty.FONT_WEIGHT]?: FontWeight;
  [TextProperty.FONT_FAMILY]?: Font;
}

declare module 'slate' {
  interface CustomTypes {
    Text: Text;
    Editor: BaseEditor & ReactEditor & HistoryEditor & FakeSelectionEditor;
    Element: Element | LinkElement;
  }
}
