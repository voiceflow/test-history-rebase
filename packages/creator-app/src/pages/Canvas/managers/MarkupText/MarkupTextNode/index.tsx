import composeRefs from '@seznam/compose-react-refs';
import React from 'react';
import { Node, Transforms } from 'slate';
import { Editable, RenderElementProps, RenderLeafProps, Slate } from 'slate-react';

import { KeyName } from '@/constants';
import { isNodeEditLockedSelector } from '@/ducks/realtime';
import { compose, connect } from '@/hocs';
import { useCache, useDebouncedCallback, useDidUpdateEffect } from '@/hooks';
import { Markup } from '@/models';
import { useBlockAPI } from '@/pages/Canvas/components/Block/hooks';
import { ConnectedMarkupNodeProps } from '@/pages/Canvas/components/MarkupNode/types';
import { EngineContext, NodeEntityContext } from '@/pages/Canvas/contexts';
import { BlockAPI } from '@/pages/Canvas/types';

import { Font, FONT_WEIGHTS_PER_FONT_FAMILY, FontWeight, SLATE_EDITOR_CLASS_NAME, TextProperty } from '../constants';
import MarkupSlateEditor from '../MarkupSlateEditor';
import { Border, BorderPosition, Container, DefaultElement, Leaf, LinkElement } from './components';
import { addDraggableAttr, findAllDraggableParents, removeDraggableAttr } from './utils';

type MarkupProps = ConnectedMarkupNodeProps<Markup.NodeData.Text> & {
  isNodeLocked: (nodeID: string) => boolean;
};

const MarkupTextNode: React.ForwardRefRenderFunction<BlockAPI, MarkupProps> = ({ node, data, isNodeLocked }, ref) => {
  const engine = React.useContext(EngineContext)!;
  const nodeEntity = React.useContext(NodeEntityContext)!;

  const isNew = React.useMemo(() => MarkupSlateEditor.isNewState(data.content), []);

  const [value, setValue] = React.useState<Node[]>(data.content);
  const [editable, setEditable] = React.useState(isNew);
  const [isInitialWidthApplied, setIsInitialWidthApplied] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const draggableParentsCache = React.useRef<HTMLElement[]>([]);

  const cache = useCache({ value, skipEditableFocus: false }, { value });

  const updateContentDebounced = useDebouncedCallback(300, () => engine.node.updateData(node.id, { content: cache.current.value }), []);

  const { isFocused, isActivated } = nodeEntity.useState((e) => ({
    isFocused: e.isFocused,
    isActivated: e.isActive,
  }));

  const editor = engine.markup.useSetupTextEditor(node.id);
  const blockAPI = useBlockAPI();

  const removeDraggableParents = React.useCallback(() => {
    const draggableParents = findAllDraggableParents(containerRef.current);

    removeDraggableAttr(draggableParents);

    draggableParentsCache.current = draggableParents;
  }, []);

  const onMouseUp = React.useCallback((event: React.MouseEvent) => event.preventDefault(), []);

  const onDragStart = React.useCallback(
    (event: React.DragEvent) => {
      if (MarkupSlateEditor.isFocused(editor)) {
        event.stopPropagation();
      }
    },
    [editor]
  );

  const onFocus = React.useCallback(() => {
    if (draggableParentsCache?.current?.length === 0) {
      removeDraggableParents();
    }

    if (engine.markup.creatingType) {
      cache.current.skipEditableFocus = true;

      setEditable(true);
      engine.markup.finishCreating?.();
    }
  }, [engine]);

  const onBlur = React.useCallback(async () => {
    if (!MarkupSlateEditor.serialize(cache.current.value)) {
      engine.node.remove(node.id);

      addDraggableAttr(draggableParentsCache.current);
      draggableParentsCache.current = [];

      return;
    }

    setEditable(false);

    if (!isInitialWidthApplied && isNew) {
      setIsInitialWidthApplied(true);

      await engine.node.updateData(node.id, { content: cache.current.value });
      await engine.node.api(nodeEntity.nodeID)?.instance?.applyTransformations?.();
    } else {
      engine.node.updateData(node.id, { content: cache.current.value });
    }

    addDraggableAttr(draggableParentsCache.current);
    draggableParentsCache.current = [];
  }, []);

  const onKeyDown = React.useCallback((event: React.KeyboardEvent) => {
    const isActionKey = event.ctrlKey || event.metaKey;

    if (event.key === KeyName.ESCAPE) {
      editor.removeFakeSelection();
      MarkupSlateEditor.deselect(editor);
      MarkupSlateEditor.blur(editor);
    } else if (isActionKey && event.key === 'b') {
      const fontFamily = MarkupSlateEditor.textProperty(editor, TextProperty.FONT_FAMILY) || Font.OPEN_SANS;
      const fontWeight = MarkupSlateEditor.textProperty(editor, TextProperty.FONT_WEIGHT) || FontWeight.REGULAR;

      const nextFontWeight = fontWeight === FontWeight.REGULAR ? FontWeight.BOLD : FontWeight.REGULAR;

      if ((FONT_WEIGHTS_PER_FONT_FAMILY[fontFamily] || FONT_WEIGHTS_PER_FONT_FAMILY[Font.OPEN_SANS])?.includes(nextFontWeight)) {
        MarkupSlateEditor.setTextProperty(editor, TextProperty.FONT_WEIGHT, nextFontWeight);
      }
    } else if (isActionKey && event.key === 'i') {
      const isItalicActive = MarkupSlateEditor.isTextPropertyActive(editor, TextProperty.ITALIC, true);

      MarkupSlateEditor.setTextProperty(editor, TextProperty.ITALIC, !isItalicActive);
    } else if (isActionKey && event.key === 'u') {
      const isUnderlineActive = MarkupSlateEditor.isTextPropertyActive(editor, TextProperty.UNDERLINE, true);

      MarkupSlateEditor.setTextProperty(editor, TextProperty.UNDERLINE, !isUnderlineActive);
    }
  }, []);

  const renderElement = React.useCallback(({ element, ...props }: RenderElementProps) => {
    if (MarkupSlateEditor.isLink(element)) {
      return <LinkElement {...props} element={element} />;
    }

    return <DefaultElement {...props} element={element} />;
  }, []);

  const onContainerDoubleClick = React.useCallback(() => {
    if (editable) {
      return;
    }

    setEditable(true);
  }, [editable]);

  const renderLeaf = React.useCallback((props: RenderLeafProps) => <Leaf {...props} />, []);

  React.useImperativeHandle(ref, () => blockAPI, [blockAPI]);

  useDidUpdateEffect(() => {
    if (isFocused && !MarkupSlateEditor.isFocused(editor) && MarkupSlateEditor.serialize(value)) {
      engine.transformation.initialize(nodeEntity.nodeID);
    }

    if (!isFocused) {
      setEditable(false);
      editor.removeFakeSelection();
      MarkupSlateEditor.deselect(editor);
      MarkupSlateEditor.blur(editor);
    }
  }, [isFocused]);

  useDidUpdateEffect(() => {
    if (editor.isFakeSelectionApplied() && engine.transformation.isTarget(nodeEntity.nodeID)) {
      engine.transformation.reset();
    }
  }, [editor.isFakeSelectionApplied()]);

  useDidUpdateEffect(() => {
    const isLocked = !!isNodeLocked?.(nodeEntity.nodeID);

    if (!isFocused || isLocked) {
      setValue(data.content);
    }
  }, [data.content]);

  useDidUpdateEffect(() => {
    if (value !== data.content && !MarkupSlateEditor.isFocused(editor)) {
      updateContentDebounced();
    }
  }, [value]);

  useDidUpdateEffect(() => {
    if (editable && !cache.current.skipEditableFocus) {
      const [node, path] = Node.last(editor, []);

      MarkupSlateEditor.focus(editor);
      Transforms.select(editor, {
        anchor: { path, offset: MarkupSlateEditor.serialize([node]).length },
        focus: { path, offset: MarkupSlateEditor.serialize([node]).length },
      });
    } else if (cache.current.skipEditableFocus) {
      cache.current.skipEditableFocus = false;
    }
  }, [editable]);

  React.useEffect(() => {
    if (isNew && isFocused && isActivated && !isInitialWidthApplied) {
      MarkupSlateEditor.focus(editor);
    }
  }, [isNew, isActivated, isFocused]);

  React.useLayoutEffect(() => {
    if (!isInitialWidthApplied && isNew && isFocused) {
      const isEmpty = MarkupSlateEditor.isNewState(value);
      const slateNodes = Array.from(containerRef.current?.querySelectorAll<HTMLElement>('[data-slate-node="element"]') ?? []);
      const maxWidth = Math.max(0, ...slateNodes.map(({ clientWidth }) => clientWidth));

      const zoom = engine.canvas?.getZoom() ?? 1;
      const width = Math.max((maxWidth + (isEmpty ? 178 : 28)) * zoom, 40 * zoom);

      engine.node.api(nodeEntity.nodeID)?.instance?.scaleText?.(width, [0, 0]);
    }

    if (!isNew && isFocused && engine.transformation.isTarget(nodeEntity.nodeID)) {
      engine.transformation.reinitialize();
    } else if (!isNew && isFocused) {
      engine.transformation.initialize(nodeEntity.nodeID);
    }
  }, [value]);

  return (
    <Container
      ref={composeRefs(containerRef, blockAPI.ref)}
      isNew={isNew && !isInitialWidthApplied}
      focused={isFocused}
      editable={editable}
      onMouseUp={onMouseUp}
      draggable
      activated={isActivated}
      onDragStart={onDragStart}
      onDoubleClick={onContainerDoubleClick}
    >
      <Border scale={data.scale} position={BorderPosition.TOP} />
      <Border scale={data.scale} position={BorderPosition.RIGHT} />
      <Border scale={data.scale} position={BorderPosition.BOTTOM} />
      <Border scale={data.scale} position={BorderPosition.LEFT} />

      <Slate editor={editor} value={value} onChange={setValue}>
        <Editable
          onBlur={onBlur}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          className={SLATE_EDITOR_CLASS_NAME}
          renderLeaf={renderLeaf}
          placeholder="Type something"
          renderElement={renderElement}
        />
      </Slate>
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
