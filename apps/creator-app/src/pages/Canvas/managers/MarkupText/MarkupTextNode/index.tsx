import composeRefs from '@seznam/compose-react-refs';
import type * as Realtime from '@voiceflow/realtime-sdk';
import { useCache, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';
import type { Descendant } from 'slate';
import { Node, Transforms } from 'slate';

import SlateEditable, { SlateEditorAPI } from '@/components/SlateEditable';
import { markupRenderElement } from '@/components/SlateEditable/renderers';
import { useForceUpdate } from '@/hooks';
import { useBlockAPI } from '@/pages/Canvas/components/Block/hooks';
import type { ConnectedMarkupNodeProps } from '@/pages/Canvas/components/MarkupNode/types';
import { EngineContext, NodeEntityContext } from '@/pages/Canvas/contexts';
import type { CombinedAPI } from '@/pages/Canvas/types';

import { SLATE_EDITOR_CLASS_NAME } from '../constants';
import { Border, BorderPosition, Container } from './components';
import { addDraggableAttr, findAllDraggableParents, removeDraggableAttr } from './utils';

interface MarkupTextNodeProps extends ConnectedMarkupNodeProps<Realtime.Markup.NodeData.Text> {}

const MarkupTextNode = React.forwardRef<CombinedAPI, MarkupTextNodeProps>(({ data }, ref) => {
  const engine = React.useContext(EngineContext)!;
  const nodeEntity = React.useContext(NodeEntityContext)!;

  const isNew = React.useMemo(() => SlateEditorAPI.isNewState(data.content), []);

  const [forceUpdate, renderKey] = useForceUpdate();
  const [value, setValue] = React.useState<Descendant[]>(data.content);
  const [editable, setEditable] = React.useState(isNew);
  const [isInitialWidthApplied, setIsInitialWidthApplied] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const draggableParentsCache = React.useRef<HTMLElement[]>([]);

  const cache = useCache({ value, skipEditableFocus: false, doubleClicked: false }, { value });

  const { isFocused, isActivated } = nodeEntity.useState((e) => ({
    isFocused: e.isFocused,
    isActivated: e.isActive,
  }));

  const editor = engine.markup.useSetupTextEditor(nodeEntity.nodeID);
  const blockAPI = useBlockAPI();

  const removeDraggableParents = () => {
    const draggableParents = findAllDraggableParents(containerRef.current);

    removeDraggableAttr(draggableParents);

    draggableParentsCache.current = draggableParents;
  };

  const onMouseUp = (event: React.MouseEvent) => {
    const middleMouseClick = event.button === 1;

    // For panning the canvas
    if (!middleMouseClick) {
      event.preventDefault();
    }
  };

  const onDragStart = (event: React.DragEvent) => {
    if (SlateEditorAPI.isFocused(editor)) {
      event.stopPropagation();
    }
  };

  const onChange = (value: Descendant[]) => {
    if (value !== cache.current.value) {
      setValue(value);
    }
  };

  const onFocus = () => {
    setEditable(true);

    if (draggableParentsCache?.current?.length === 0) {
      removeDraggableParents();
    }

    if (!cache.current.doubleClicked) {
      cache.current.skipEditableFocus = true;
    }

    if (engine.markup.creatingType) {
      cache.current.skipEditableFocus = true;

      engine.markup.finishCreating?.();
    }

    cache.current.doubleClicked = false;
  };

  const onBlur = async () => {
    if (!SlateEditorAPI.serialize(cache.current.value)) {
      await engine.node.remove(nodeEntity.nodeID);

      addDraggableAttr(draggableParentsCache.current);
      draggableParentsCache.current = [];

      return;
    }

    setEditable(false);

    if (!isInitialWidthApplied && isNew) {
      setIsInitialWidthApplied(true);

      await engine.node.api(nodeEntity.nodeID)?.instance?.applyTransformations?.();
    }

    await engine.node.updateData(nodeEntity.nodeID, { content: cache.current.value });

    addDraggableAttr(draggableParentsCache.current);
    draggableParentsCache.current = [];
  };

  const onContainerDoubleClick = () => {
    if (editable) return;

    cache.current.doubleClicked = true;

    setEditable(true);
  };

  const isFakeSelectionApplied = editor.isFakeSelectionApplied();

  React.useImperativeHandle(ref, () => blockAPI, [blockAPI]);

  useDidUpdateEffect(() => {
    if (isFocused && !SlateEditorAPI.isFocused(editor) && SlateEditorAPI.serialize(value)) {
      engine.transformation.initialize(nodeEntity.nodeID);
    }

    if (!isFocused) {
      setEditable(false);
      editor.removeFakeSelection();
      SlateEditorAPI.deselect(editor);
      SlateEditorAPI.blur(editor);
    }
  }, [isFocused]);

  useDidUpdateEffect(() => {
    if (isFakeSelectionApplied && engine.transformation.isTarget(nodeEntity.nodeID)) {
      engine.transformation.reset();
    }
  }, [isFakeSelectionApplied]);

  useDidUpdateEffect(() => {
    if (!isFocused) {
      setValue(data.content);
      forceUpdate();
    }
  }, [data.content]);

  useDidUpdateEffect(() => {
    if (editable && !cache.current.skipEditableFocus) {
      const [node, path] = Node.last(editor, []);

      SlateEditorAPI.focus(editor);
      Transforms.select(editor, {
        anchor: { path, offset: SlateEditorAPI.serialize([node]).length },
        focus: { path, offset: SlateEditorAPI.serialize([node]).length },
      });
    } else if (cache.current.skipEditableFocus) {
      cache.current.skipEditableFocus = false;
    }
  }, [editable]);

  React.useEffect(() => {
    if (isNew && isFocused && isActivated && !isInitialWidthApplied) {
      requestAnimationFrame(() => SlateEditorAPI.focus(editor));
    }
  }, [isNew, isActivated, isFocused]);

  React.useLayoutEffect(() => {
    if (!isInitialWidthApplied && isNew && isFocused) {
      const isEmpty = SlateEditorAPI.isNewState(value);
      const slateNodes = Array.from(
        containerRef.current?.querySelectorAll<HTMLElement>('[data-slate-node="element"]') ?? []
      );
      const maxWidth = Math.max(0, ...slateNodes.map(({ clientWidth }) => clientWidth));

      const zoom = engine.canvas?.getZoom() ?? 1;
      const width = Math.max((maxWidth + (isEmpty ? 178 : 28)) * zoom, 40 * zoom);

      engine.node.api(nodeEntity.nodeID)?.instance?.scaleText?.(width, [0, 0]);
    }

    if ((!isNew || isInitialWidthApplied) && isFocused && engine.transformation.isTarget(nodeEntity.nodeID)) {
      engine.transformation.syncOverlay(engine.transformation.getTransform()!);
    } else if ((!isNew || isInitialWidthApplied) && isFocused) {
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

      <SlateEditable
        key={renderKey}
        value={value}
        editor={editor}
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={onChange}
        className={SLATE_EDITOR_CLASS_NAME}
        placeholder="Type something"
        renderElement={markupRenderElement}
      />
    </Container>
  );
});

export default MarkupTextNode;
