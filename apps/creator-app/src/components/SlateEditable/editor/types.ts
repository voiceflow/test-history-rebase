import type { Text } from '@voiceflow/base-types';
import type { BaseEditor, BaseRange, BaseText } from 'slate';
import type { HistoryEditor } from 'slate-history';
import type { ReactEditor } from 'slate-react';

import type { PluginsEditor, PluginsRange, PluginsText } from './plugins';

export type { Color, Element, ElementType, LinkElement, Text, VariableElement } from '@voiceflow/base-types/build/esm/text';

export interface Editor extends BaseEditor, ReactEditor, HistoryEditor, PluginsEditor {}

declare module 'slate' {
  interface CustomTypes {
    Text: BaseText & Text.Text & PluginsText;
    Range: BaseRange & PluginsRange;
    Editor: Editor;
    Element: Text.AnyElement;
  }
}
