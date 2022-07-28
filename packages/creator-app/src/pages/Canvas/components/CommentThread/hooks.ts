import { Eventual } from '@voiceflow/common';
import { useCreateConst } from '@voiceflow/ui';
import React from 'react';

import { useCancellable, useLinkedRef } from '@/hooks';
import { EditableCommentRef } from '@/pages/Canvas/components/ThreadEditor';
import { EngineContext, ThreadEntityContext } from '@/pages/Canvas/contexts';
import { useElementInstance } from '@/pages/Canvas/engine/entities/utils';
import { useVectorDragTranslate } from '@/pages/Canvas/hooks/drag';
import { CommentDraftValue } from '@/pages/Canvas/types';
import { Pair } from '@/types';
import MouseMovement from '@/utils/mouseMovement';

import { InternalThreadInstance } from './types';

enum CommentState {
  IDLE = 'idle',
  CLICKING = 'clicking',
  CLICKED = 'clicked',
  DRAGGING = 'dragging',
}

const DOUBLE_CLICK_TIMEOUT = 175;

export const useThreadCoords = () => {
  const threadEntity = React.useContext(ThreadEntityContext)!;
  const coords = threadEntity.useCoordinates();

  return useLinkedRef(coords);
};

export const useThreadInstance = <T extends HTMLElement>(): InternalThreadInstance<T> => {
  const ref = React.useRef<T | null>(null);
  const coords = useThreadCoords();
  const commentRef = React.useRef<EditableCommentRef>(null);

  const elementInstance = useElementInstance(ref);

  const [translate, updateCoords] = useVectorDragTranslate(ref, coords);

  return React.useMemo<InternalThreadInstance<T>>(
    () => ({
      ...elementInstance,

      ref,
      getCoords: () => coords.current!,

      translate,
      forceRedraw: updateCoords,

      getDraft: () => commentRef.current?.getDraft() ?? null,
      setDraft: (value: CommentDraftValue) => commentRef.current?.setDraft(value) ?? null,
      commentRef,
    }),
    [elementInstance]
  );
};

export const useThreadHandlers = (
  {
    drag,
    drop,
    click,
    doubleClick,
    mousedown,
    mouseup,
  }: {
    drag?: (movement: Pair<number>) => Eventual<void>;
    drop?: () => Eventual<void>;
    click?: () => void;
    doubleClick?: () => void;
    mousedown?: () => void;
    mouseup?: () => void;
  },
  dependencies: any[] = []
) => {
  const engine = React.useContext(EngineContext)!;
  const stateRef = React.useRef(CommentState.IDLE);

  const mouseMovement = useCreateConst(() => new MouseMovement());

  const [addDragListener, teardownDragListener] = useCancellable(() => {
    const onDrag = async (event: MouseEvent) => {
      mouseMovement.track(event);

      const [movementX, movementY] = mouseMovement.getBoundedMovement();
      const zoom = engine.canvas!.getZoom();

      await drag?.([movementX / zoom, movementY / zoom]);
    };

    document.addEventListener('mousemove', onDrag);

    return () => document.removeEventListener('mousemove', onDrag);
  }, dependencies);

  const [waitForDoubleClick, teardownDoubleClickListener] = useCancellable(() => {
    const timeout = setTimeout(() => {
      stateRef.current = CommentState.IDLE;
      mouseup?.();
      click?.();
    }, DOUBLE_CLICK_TIMEOUT);

    return () => clearTimeout(timeout);
  }, dependencies);

  const [addMouseUpListener, teardownMouseUpListener] = useCancellable(() => {
    const onMouseUp = async (event: MouseEvent) => {
      if (event.defaultPrevented) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      teardownMouseUpListener();
      teardownDragListener();

      mouseMovement.clear();

      if (stateRef.current === CommentState.DRAGGING) {
        stateRef.current = CommentState.IDLE;
        mouseup?.();
        await drop?.();
      } else if (stateRef.current === CommentState.CLICKING) {
        stateRef.current = CommentState.CLICKED;
        waitForDoubleClick();
      }
    };

    document.addEventListener('mouseup', onMouseUp, { once: true });

    return () => {
      mouseMovement.clear();

      document.removeEventListener('mouseup', onMouseUp);
    };
  }, dependencies);

  const onDragStart = React.useCallback((event: React.DragEvent) => {
    if (event.defaultPrevented) return;

    event.preventDefault();

    stateRef.current = CommentState.DRAGGING;

    addDragListener();
  }, dependencies);

  const onMouseDown = React.useCallback((event: React.MouseEvent) => {
    if (event.defaultPrevented) return;

    event.stopPropagation();
    event.nativeEvent.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();

    if (stateRef.current !== CommentState.IDLE) return;

    stateRef.current = CommentState.CLICKING;

    addMouseUpListener();
    mousedown?.();
  }, dependencies);

  const onClick = React.useCallback((event: React.MouseEvent) => {
    if (event.defaultPrevented) return;

    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
  }, dependencies);

  const onDoubleClick = React.useCallback((event: React.MouseEvent) => {
    if (stateRef.current !== CommentState.CLICKED) return;

    event.preventDefault();

    stateRef.current = CommentState.IDLE;

    teardownDoubleClickListener();
    doubleClick?.();
  }, dependencies);

  return { onDragStart, onMouseDown, onClick, onDoubleClick };
};
