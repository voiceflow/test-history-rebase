import { IconName } from '@voiceflow/icons';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { generatePath } from 'react-router-dom';

import { Path } from '@/config/routes';

import { NodeEditorV2Props } from '../../managers/types';
import { EditorSidebarContext } from '../EditorSidebarV2';
import { EditorParentMatchContext } from './context';
import { EditorV3Action } from './types';

export const useParentMatch = () => {
  const parentMatch = React.useContext(EditorParentMatchContext);

  return React.useMemo(() => {
    if (!parentMatch) return null;

    const parentPath = parentMatch.path.replace(Path.CANVAS_NODE, '');

    return {
      ...parentMatch,
      parentUrl: generatePath(parentPath, parentMatch.params),
      parentPath,
    };
  }, [parentMatch?.url]);
};

export const useEditor = <Data, BuiltInPorts extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord>(): NodeEditorV2Props<
  Data,
  BuiltInPorts
> => {
  const editor = React.useContext(EditorSidebarContext)! as NodeEditorV2Props<Data, BuiltInPorts>;
  const parentMatch = useParentMatch();

  const goBack: typeof editor.goBack = React.useCallback(
    (path) => {
      if (!path && parentMatch?.parentUrl) {
        editor.goBack(parentMatch.parentUrl);
      } else if (!path || typeof path === 'string') {
        editor.goBack(path);
      } else {
        editor.goBack(path);
      }
    },
    [editor.goBack, parentMatch?.parentUrl]
  );

  return { ...editor, goBack };
};

export const useEditorV3DefaultActions = (): EditorV3Action[] => {
  const editor = useEditor();

  // TODO: remove type casting
  return [
    { label: 'Duplicate', icon: 'Duplicate' as IconName, onClick: () => editor.engine.node.duplicateMany([editor.nodeID]) },
    { label: 'Delete', icon: 'Trash', onClick: () => editor.engine.node.remove(editor.nodeID) },
  ];
};
