import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { useParams } from 'react-router-dom';

import { NodeEditorV2Props } from '../../managers/types';
import { EditorSidebarProvider } from '../EditorSidebarV2/context';
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

export const withGoBack =
  (parentPath: string): ((component: React.FC) => React.FC) =>
  (Component: React.FC<{ goBack?: VoidFunction }>) =>
  () => {
    const editor = useEditor();
    const params = useParams();

    const goBack: NodeEditorV2Props<any>['goBack'] = React.useCallback(
      (options) => editor.goBack<any>(options ?? { path: parentPath, params }),
      [editor, parentPath, params]
    );

    return (
      <EditorSidebarProvider value={{ ...editor, goBack }}>
        <Component goBack={goBack} />
      </EditorSidebarProvider>
    );
  };
