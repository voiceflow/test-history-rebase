import { DraftHandleValue, EditorState, RichUtils } from 'draft-js';
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
  const selectionCache = React.useRef<{ focusKey: string; anchorKey: string }>({ focusKey: '', anchorKey: '' });

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

  const handleReturn = React.useCallback((_, state: EditorState) => {
    setEditorState(RichUtils.insertSoftNewline(state));

    return 'handled' as DraftHandleValue;
  }, []);

  const onChange = React.useCallback(
    (state: EditorState) => {
      const selection = state.getSelection();

      const focusKey = selection.getFocusKey();
      const anchorKey = selection.getAnchorKey();

      if (isFocused && !selection.isCollapsed() && (selectionCache.current.focusKey !== focusKey || selectionCache.current.anchorKey !== anchorKey)) {
        setEditorState(pluginsObj.fakeSelectionPlugin.removeFakeSelection(state));
      } else {
        setEditorState(state);
      }
    },
    [isFocused]
  );

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

    if (!isFocused) {
      editorRef.current?.blur();
    }
  }, [isFocused]);

  return (
    <Container draggable onDragStart={onDragStart} ref={ref}>
      <DraftJSEditor
        ref={editorRef}
        ariaMultiline
        onBlur={onBlur}
        plugins={plugins}
        onFocus={onFocus}
        onChange={onChange}
        editorState={editorState}
        placeholder="Type something"
        handleReturn={handleReturn}
        keyBindingFn={keyBindingFn}
        customStyleFn={customStyleFn}
        textAlignment={data.textAlignment}
        stripPastedStyles
      />
    </Container>
  );
};

export default React.forwardRef(MarkupTextNode);
