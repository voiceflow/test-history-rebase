/* eslint-disable @typescript-eslint/no-empty-interface */
import type { Text } from '@voiceflow/base-types';
import type { BaseEditor } from 'slate';
import type { HistoryEditor } from 'slate-history';
import type { ReactEditor } from 'slate-react';

import type { PluginsEditor, PluginsRange, PluginsText } from './plugins';

export type { Color, Element, ElementType, LinkElement, Text, VariableElement } from '@voiceflow/base-types/build/esm/text';

export interface Editor extends BaseEditor, ReactEditor, HistoryEditor, PluginsEditor {}

declare module 'slate' {
  interface BaseText extends PluginsText {}
  interface BaseRange extends PluginsRange {}
  interface CustomTypes {
    Text: Text.Text;
    Editor: Editor;
    Element: Text.AnyElement;
  }
}
