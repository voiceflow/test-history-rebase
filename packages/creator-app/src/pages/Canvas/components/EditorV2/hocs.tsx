import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { NodeEditorV2Props } from '../../managers/types';
import { RedirectToRoot } from './components';
import { useEditor } from './hooks';

export const withRedirectToRoot =
  <Data, BuiltInPorts extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord>(
    useShouldRedirect: (editor: NodeEditorV2Props<Data, BuiltInPorts>) => boolean
  ): ((component: React.FC) => React.FC) =>
  (Component: React.FC) =>
  () => {
    const editor = useEditor<Data, BuiltInPorts>();
    const shouldRedirect = useShouldRedirect(editor);

    return shouldRedirect ? <RedirectToRoot /> : <Component />;
  };
