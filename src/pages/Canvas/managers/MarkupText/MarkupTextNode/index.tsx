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

const MarkupTextNode: React.RefForwardingComponent<HTMLDivElement, ConnectedMarkupNodeProps<Markup.NodeData.Text>> = ({ node, data }, ref) => {
  const editorRef = React.useRef<BaseDraftJSEditor>(null);

  const cachedContent = React.useRef(data.content);
  const [editorState, setEditorState] = React.useState(() => createEditorState(data.content));

  const engine = React.useContext(EngineContext)!;
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const { isFocused } = nodeEntity.useState((e) => ({
    isFocused: e.isFocused,
  }));

  const pluginsObj = engine.markup.useSetupPlugins(node.id, { anchorOptions: { Link } });
  const plugins = React.useMemo(() => Object.values(pluginsObj), [pluginsObj]);

  const onBlur = React.useCallback(() => {
    const content = getRawContent(editorState);

    if (!editorState.getCurrentContent().getPlainText().trim()) {
      engine.node.remove(node.id);

      return;
    }

    cachedContent.current = content;

    engine.node.updateData(node.id, { content });
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

  const onFocus = React.useCallback(() => engine.transformation.reset(), []);

  const onDragStart = React.useCallback(
    (event: React.DragEvent) => {
      const hasFocus = editorState.getSelection().getHasFocus();

      if (hasFocus) {
        event.preventDefault();
      }
    },
    [editorState]
  );

  React.useEffect(() => {
    if (isFocused && !editorState.getSelection().getHasFocus() && !editorState.getCurrentContent().isEmpty()) {
      engine.transformation.initialize(nodeEntity.nodeID);
    }
  }, [isFocused]);

  return (
    <Container draggable onDragStart={onDragStart} ref={ref}>
      <DraftJSEditor
        ref={editorRef}
        plugins={plugins}
        onFocus={onFocus}
        onChange={onChange}
        onBlur={onBlur}
        keyBindingFn={keyBindingFn}
        editorState={editorState}
        placeholder="Type something"
        customStyleFn={customStyleFn}
        textAlignment={data.textAlignment}
      />
    </Container>
  );
};

export default React.forwardRef(MarkupTextNode);
