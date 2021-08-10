/* eslint-disable @typescript-eslint/no-empty-interface */
import type { AnyElement, Text } from '@voiceflow/general-types/build/nodes/text';
import type { BaseEditor } from 'slate';
import type { HistoryEditor } from 'slate-history';
import type { ReactEditor } from 'slate-react';

import type { PluginsEditor, PluginsText } from './plugins';

export type { Color, Element, ElementType, LinkElement, Text } from '@voiceflow/general-types/build/nodes/text';

export interface Editor extends BaseEditor, ReactEditor, HistoryEditor, PluginsEditor {}

declare module 'slate' {
  interface BaseText extends PluginsText {}
  interface CustomTypes {
    Text: Text;
    Editor: Editor;
    Element: AnyElement;
  }
}
