import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { NodeEditorV2Props } from '../../managers/types';
import { EditorSidebarContext } from '../EditorSidebarV2';

export const useEditor = <Data, BuiltInPorts extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord>(): NodeEditorV2Props<
  Data,
  BuiltInPorts
> => {
  return React.useContext(EditorSidebarContext)! as NodeEditorV2Props<Data, BuiltInPorts>;
};
