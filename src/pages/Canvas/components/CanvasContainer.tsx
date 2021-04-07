import cn from 'classnames';
import React from 'react';

import Drawer from '@/components/Drawer';
import { toast } from '@/components/Toast';
import { isSafari } from '@/config';
import { MARKUP_NODES, MarkupModeType } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as Prototype from '@/ducks/prototype';
import { connect, css, styled } from '@/hocs';
import { useActiveModal, useHotKeys, useRegistration, useSetup } from '@/hooks';
import { Hotkey } from '@/keymap';
import { ClipboardContext, EngineContext, SpotlightContext } from '@/pages/Canvas/contexts';
import { CanvasContainerAPI } from '@/pages/Canvas/types';
import { MarkupModeContext } from '@/pages/Skill/contexts';
import { useCommentingMode, useEditingMode, useMarkupMode, usePrototypingMode } from '@/pages/Skill/hooks';
import { Identifier } from '@/styles/constants';
import { Callback, ConnectedProps } from '@/types';

import {
  CANVAS_COMMENTING_ENABLED_CLASSNAME,
  CANVAS_HIDDEN_CLASSNAME,
  CANVAS_MARKUP_CREATING_CLASSNAME,
  CANVAS_MARKUP_ENABLED_CLASSNAME,
  CANVAS_PROTOTYPE_ENABLED_CLASSNAME,
  CANVAS_PROTOTYPE_RUNNING_CLASSNAME,
  CANVAS_THREAD_OPEN_CLASSNAME,
} from '../constants';

export const MARKUP_MODE_CURSORS: Record<MarkupModeType, string> = {
  [MarkupModeType.TEXT]: 'text',
  [MarkupModeType.IMAGE]: 'default',
};

const Wrapper = styled.div<{ markupMode: MarkupModeType | null }>`
  width: ${isSafari ? '100vw' : '100%'};
  height: ${isSafari ? 'calc(100vh - 120px)' : '100%'};
  overflow: hidden;

  ${({ markupMode }) =>
    markupMode &&
    css`
      &.${CANVAS_MARKUP_CREATING_CLASSNAME} {
        cursor: ${MARKUP_MODE_CURSORS[markupMode]};
      }
    `}

  &.${CANVAS_HIDDEN_CLASSNAME} {
    display: none;
  }

  &.${CANVAS_COMMENTING_ENABLED_CLASSNAME} {
    cursor: crosshair;

    ${Drawer} {
      cursor: pointer;
    }
  }

  &.${CANVAS_COMMENTING_ENABLED_CLASSNAME}.${CANVAS_THREAD_OPEN_CLASSNAME} {
    cursor: default;
  }
`;

const CanvasContainer: React.FC<ConnectedCanvasContainerProps> = ({
  undoHistory,
  redoHistory,
  children,
  focusedNode,
  clearFocus,
  prototypeStatus,
  isCanvasHidden,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const engine = React.useContext(EngineContext)!;
  const clipboard = React.useContext(ClipboardContext)!;
  const spotlight = React.useContext(SpotlightContext)!;
  const { isCreating: isMarkupCreating, modeType: markupModeType } = React.useContext(MarkupModeContext)!;
  const isCommentingMode = useCommentingMode();
  const isMarkupMode = useMarkupMode();
  const isEditingMode = useEditingMode();
  const isPrototypingMode = usePrototypingMode();

  const activeModal = useActiveModal();

  const canDelete = isEditingMode && !activeModal;
  const disableSpotlight = !isEditingMode || isMarkupMode || !!activeModal;

  const showSpotlight = React.useCallback(() => !disableSpotlight && spotlight.toggle(), [disableSpotlight]);
  const deleteActive = React.useCallback<Callback>(() => canDelete && engine.removeActive(), [canDelete]);

  const api = React.useMemo<CanvasContainerAPI>(
    () => ({
      addClass: (className) => ref.current?.classList.add(className),
      removeClass: (className) => ref.current?.classList.remove(className),
    }),
    []
  );

  const onDuplicate = React.useCallback(() => {
    const targets = engine.activation.getTargets();
    if (targets.length === 1) {
      const nodeID = targets[0];

      engine.node.api(nodeID)?.instance?.blur?.();
      engine.node.duplicate(nodeID);
    } else if (targets.length > 1) {
      toast.error('Group duplication is not supported.');
    }
  }, []);

  useSetup(() => {
    if (focusedNode && MARKUP_NODES.includes(focusedNode.type)) {
      clearFocus();
    }
  });

  useRegistration(() => engine.register('container', api), [api]);

  useHotKeys(Hotkey.COPY, () => clipboard.copy(), { preventDefault: true });
  useHotKeys(Hotkey.DELETE, deleteActive, { preventDefault: true }, [deleteActive]);
  useHotKeys(Hotkey.UNDO, undoHistory as Callback, { preventDefault: true });
  useHotKeys(Hotkey.REDO, redoHistory as Callback, { preventDefault: true });
  useHotKeys(Hotkey.SPOTLIGHT, showSpotlight, { action: 'keyup', preventDefault: true }, [showSpotlight]);
  useHotKeys(Hotkey.DUPLICATE, onDuplicate, { preventDefault: true });

  return (
    <Wrapper
      id={Identifier.CANVAS_CONTAINER}
      className={cn({
        [CANVAS_HIDDEN_CLASSNAME]: isCanvasHidden,
        [CANVAS_COMMENTING_ENABLED_CLASSNAME]: isCommentingMode,
        [CANVAS_MARKUP_ENABLED_CLASSNAME]: isMarkupMode,
        [CANVAS_PROTOTYPE_ENABLED_CLASSNAME]: isPrototypingMode,
        [CANVAS_MARKUP_CREATING_CLASSNAME]: isMarkupCreating,
        [CANVAS_PROTOTYPE_RUNNING_CLASSNAME]: prototypeStatus === Prototype.PrototypeStatus.ACTIVE,
      })}
      markupMode={markupModeType}
      data-markup={markupModeType}
      ref={ref}
    >
      {children}
    </Wrapper>
  );
};

const mapStateToProps = {
  isCanvasHidden: Creator.isHiddenSelector,
  focusedNode: Creator.focusedNodeSelector,
  prototypeStatus: Prototype.prototypeStatusSelector,
};

const mapDispatchToProps = {
  clearFocus: Creator.clearFocus,
  undoHistory: Creator.undoHistory,
  redoHistory: Creator.redoHistory,
};

type ConnectedCanvasContainerProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(CanvasContainer) as React.FC;
