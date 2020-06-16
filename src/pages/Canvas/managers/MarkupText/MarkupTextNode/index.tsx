import { EditorState } from 'draft-js';
import type BaseDraftJSEditor from 'draft-js-plugins-editor';
import React from 'react';

import DraftJSEditor from '@/components/DraftJSEditor';
import { Markup } from '@/models';
import { ConnectedMarkupNodeProps } from '@/pages/Canvas/components/MarkupNode/types';
import { EngineContext, NodeEntityContext } from '@/pages/Canvas/contexts';

import { getRawContent } from '../utils';
import { Container, Link } from './components';
import { createEditorState, customStyleFn } from './utils';

const MarkupTextNode: React.FC<ConnectedMarkupNodeProps<Markup.NodeData.Text>> = ({ node, data }) => {
  const editorRef = React.useRef<BaseDraftJSEditor>(null);

  const cachedContent = React.useRef(data.content);
  const [editorState, setEditorState] = React.useState(() => createEditorState(data.content));

  const engine = React.useContext(EngineContext)!;
  const nodeEntity = React.useContext(NodeEntityContext)!;

  const pluginsObj = engine.markup.useSetupPlugins(node.id, { anchorOptions: { Link } });
  const plugins = React.useMemo(() => Object.values(pluginsObj), [pluginsObj]);

  const onBlur = React.useCallback(() => {
    const content = getRawContent(editorState);

    cachedContent.current = content;

    engine.node.updateData(node.id, { content });

    if (nodeEntity.isFocused) {
      engine.transformation.initialize(nodeEntity.nodeID);
    }
  }, [editorState, nodeEntity.isFocused]);

  const keyBindingFn = React.useCallback(({ keyCode }: React.KeyboardEvent) => {
    // esc
    if (keyCode === 27) {
      editorRef.current?.blur();
    }

    return null;
  }, []);

  const onChange = React.useCallback((state: EditorState) => {
    setEditorState(state);
  }, []);

  const onFocus = React.useCallback(() => {
    if (nodeEntity.isFocused) {
      engine.transformation.reset();
    }
  }, [nodeEntity.isFocused]);

  return (
    <Container scale={data.scale}>
      <DraftJSEditor
        ref={editorRef}
        onBlur={onBlur}
        plugins={plugins}
        onFocus={onFocus}
        onChange={onChange}
        keyBindingFn={keyBindingFn}
        editorState={editorState}
        placeholder="Type something"
        customStyleFn={customStyleFn}
        textAlignment={data.textAlignment}
      />
    </Container>
  );
};

export default MarkupTextNode;
