import * as Realtime from '@voiceflow/realtime-sdk';

import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { ActionEditorProps } from '@/pages/Canvas/managers/types';

export const useEditor = <Data, BuiltInPorts extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord>(): ActionEditorProps<
  Data,
  BuiltInPorts
> => EditorV2.useEditor() as ActionEditorProps<Data, BuiltInPorts>;
