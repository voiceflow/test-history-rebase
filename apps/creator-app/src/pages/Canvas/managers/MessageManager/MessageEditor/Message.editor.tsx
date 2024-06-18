import { ResponseType } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { Designer } from '@/ducks';
import { useUnmount } from '@/hooks/lifecircle.hook';
import { useDispatch } from '@/hooks/store.hook';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

import { NodeEditorV2 } from '../../types';
import { MessageEditorRoot } from './MessageEditorRoot.component';

export const MessageEditor: NodeEditorV2<Realtime.NodeData.Response> = ({ node, engine, onChange }) => {
  const deleteResponse = useDispatch(Designer.Response.effect.deleteOne);

  useUnmount(() => {
    const { responseID, responseType } = engine.getDataByNodeID(node.id) as Realtime.NodeData.Response;

    if (!responseID) return;

    if (responseType === ResponseType.EMPTY) {
      deleteResponse(responseID);
      onChange({ responseID: null });
    }
  });

  return <EditorV2.Route component={MessageEditorRoot}></EditorV2.Route>;
};
