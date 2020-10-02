import composeRefs from '@seznam/compose-react-refs';
import { DraftHandleValue, EditorState, RichUtils } from 'draft-js';
import type BaseDraftJSEditor from 'draft-js-plugins-editor';
import _last from 'lodash/last';
import React from 'react';

import DraftJSEditor from '@/components/DraftJSEditor';
import { deleteHandler } from '@/components/TextEditor/plugins/base/utils';
import { isFirefox } from '@/config';
import { isNodeEditLockedSelector } from '@/ducks/realtime';
import { compose, connect } from '@/hocs';
import { useDidUpdateEffect } from '@/hooks';
import { Markup } from '@/models';
import { useBlockAPI } from '@/pages/Canvas/components/Block/hooks';
import { ConnectedMarkupNodeProps } from '@/pages/Canvas/components/MarkupNode/types';
import { EngineContext, NodeEntityContext } from '@/pages/Canvas/contexts';
import { BlockAPI } from '@/pages/Canvas/types';

import { FontWeight, InlineStylePrefix } from '../constants';
import { getInlineStylePrefixAndValue, getRawContent, getSelectionPrefixedInlineStyle, togglePrefixedInlineStyle } from '../utils';
import { Container, Link } from './components';
import { createEditorState, customStyleFn, findAllDraggableParents } from './utils';

type MarkupProps = ConnectedMarkupNodeProps<Markup.NodeData.Text> & {
  isNodeLocked: (nodeID: string) => boolean;
};

const MarkupTextNode: React.ForwardRefRenderFunction<BlockAPI, MarkupProps> = ({ node, data, isNodeLocked }, ref) => {
  const editorRef = React.useRef<BaseDraftJSEditor>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const draggableParentsCache = React.useRef<HTMLElement[]>([]);
  const [editorState, setEditorState] = React.useState(() => createEditorState(data.content));
  const selectionCache = React.useRef<{ focusKey: string; anchorKey: string; anchorOffset: number; focusOffset: number }>({
    focusKey: '',
    anchorKey: '',
    focusOffset: 0,
    anchorOffset: 0,
  });
  const engine = React.useContext(EngineContext)!;
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const { isFocused, isActivated } = nodeEntity.useState((e) => ({
    isFocused: e.isFocused,
    isActivated: e.isActive,
  }));

  const pluginsObj = engine.markup.useSetupPlugins(node.id, { anchorOptions: { Link } });
  const plugins = React.useMemo(() => Object.values(pluginsObj), [pluginsObj]);

  const removeDraggables = () => {
    const draggableParents = findAllDraggableParents(containerRef.current!);

    draggableParents.forEach((parentNode) => parentNode.removeAttribute('draggable'));

    draggableParentsCache.current = draggableParents;
  };

  useDidUpdateEffect(() => {
    const isLocked = !!isNodeLocked?.(nodeEntity.nodeID);
    if (!isFocused || isLocked) {
      setEditorState(createEditorState(data.content));
    }
  }, [data.content, isFocused]);

  const onBlur = React.useCallback(() => {
    const content = getRawContent(editorState);
    if (!editorState.getCurrentContent().getPlainText().trim()) {
      engine.node.remove(node.id);

      return;
    }

    engine.node.updateData(node.id, { content });

    if (isFirefox) {
      draggableParentsCache.current?.forEach((parentNode) => parentNode.setAttribute('draggable', 'true'));
      draggableParentsCache.current = [];
    }
  }, [editorState, nodeEntity.isFocused]);

  const keyBindingFn = React.useCallback(
    (e: React.KeyboardEvent) => {
      const getEditorState = pluginsObj.toolbarPlugin.store.getItem<() => EditorState>('getEditorState');
      const resetEditorState = pluginsObj.toolbarPlugin.store.getItem<(state: EditorState) => void>('setEditorState');

      // delete
      if (e.keyCode === 127 || e.keyCode === 8) {
        deleteHandler({
          getEditorState,
          setEditorState: resetEditorState,
        })(e);

        return 'handled';
      }

      // esc
      if (e.keyCode === 27) {
        editorRef.current?.blur();
      }

      const state = getEditorState();

      // bold
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        const fontWeightStyle = _last(getSelectionPrefixedInlineStyle(state, InlineStylePrefix.FONT_WEIGHT));
        const fontWeight = (getInlineStylePrefixAndValue(fontWeightStyle)[1] as FontWeight) || FontWeight.REGULAR;
        const newFontWeight = fontWeight === FontWeight.REGULAR ? FontWeight.BOLD : FontWeight.REGULAR;

        resetEditorState(togglePrefixedInlineStyle(state, InlineStylePrefix.FONT_WEIGHT, newFontWeight));

        return 'change-inline-style';
      }

      // italic
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        resetEditorState(RichUtils.toggleInlineStyle(state, 'ITALIC'));

        return 'italic';
      }

      // underline
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        resetEditorState(RichUtils.toggleInlineStyle(state, 'UNDERLINE'));

        return 'underline';
      }

      return null;
    },
    [pluginsObj]
  );

  const handleReturn = React.useCallback((_, state: EditorState) => {
    setEditorState(RichUtils.insertSoftNewline(state));

    return 'handled' as DraftHandleValue;
  }, []);

  const onChange = React.useCallback(
    (state: EditorState) => {
      const selection = state.getSelection();

      const focusKey = selection.getFocusKey();
      const anchorKey = selection.getAnchorKey();
      const focusOffset = selection.getFocusOffset();
      const anchorOffset = selection.getAnchorOffset();

      const selectionChanged =
        selectionCache.current.focusKey !== focusKey ||
        selectionCache.current.anchorKey !== anchorKey ||
        selectionCache.current.focusOffset !== focusOffset ||
        selectionCache.current.anchorOffset !== anchorOffset;

      if (isFocused && selection.getHasFocus() && selectionChanged) {
        setEditorState(togglePrefixedInlineStyle(state, InlineStylePrefix.FAKE_SELECTION));
      } else {
        setEditorState(state);
      }

      if (!selection.getHasFocus()) {
        selectionCache.current.focusKey = focusKey;
        selectionCache.current.anchorKey = anchorKey;
        selectionCache.current.focusOffset = focusOffset;
        selectionCache.current.anchorOffset = anchorOffset;
      }

      // for some reason onFocus event is not triggered when setting focus manually via setEditorState
      if (isFirefox && selection.getHasFocus() && draggableParentsCache?.current?.length === 0) {
        removeDraggables();
      }
    },
    [isFocused]
  );

  const onFocus = React.useCallback(() => {
    engine.transformation.reset();

    if (isFirefox && draggableParentsCache?.current?.length === 0) {
      removeDraggables();
    }
  }, []);

  const onDragStart = React.useCallback(
    (event: React.DragEvent) => {
      const hasFocus = editorState.getSelection().getHasFocus();

      if (hasFocus) {
        event.stopPropagation();
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

  const blockAPI = useBlockAPI();

  React.useImperativeHandle(ref, () => blockAPI, [blockAPI]);

  return (
    <Container activated={isActivated} draggable onDragStart={onDragStart} ref={composeRefs(containerRef, blockAPI.ref)}>
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

const mapStateToProps = {
  isNodeLocked: isNodeEditLockedSelector,
};

export default compose(
  connect(mapStateToProps, null, null, { forwardRef: true }),
  React.forwardRef
)(MarkupTextNode) as React.ForwardRefRenderFunction<HTMLDivElement, ConnectedMarkupNodeProps<Markup.NodeData.Text>>;
