import { IS_SAFARI, toast } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';

import Drawer from '@/components/Drawer';
import { BlockType } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as Prototype from '@/ducks/prototype';
import { connect, styled } from '@/hocs';
import { useActiveModal, useHotKeys, useRegistration } from '@/hooks';
import { Hotkey } from '@/keymap';
import { ClipboardContext, EngineContext, SpotlightContext } from '@/pages/Canvas/contexts';
import { CanvasContainerAPI } from '@/pages/Canvas/types';
import { MarkupContext } from '@/pages/Skill/contexts';
import { useCommentingMode, useEditingMode, usePrototypingMode } from '@/pages/Skill/hooks';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import {
  CANVAS_COMMENTING_ENABLED_CLASSNAME,
  CANVAS_HIDDEN_CLASSNAME,
  CANVAS_MARKUP_CREATING_CLASSNAME,
  CANVAS_PROTOTYPE_ENABLED_CLASSNAME,
  CANVAS_PROTOTYPE_RUNNING_CLASSNAME,
  CANVAS_THREAD_OPEN_CLASSNAME,
} from '../constants';

const Wrapper = styled.div`
  width: ${IS_SAFARI ? '100vw' : '100%'};
  height: ${IS_SAFARI ? 'calc(100vh - 120px)' : '100%'};
  overflow: hidden;

  &.${CANVAS_MARKUP_CREATING_CLASSNAME}[data-markup-creating-type="${BlockType.MARKUP_TEXT}"] {
    cursor: text;
  }

  &.${CANVAS_MARKUP_CREATING_CLASSNAME}[data-markup-creating-type="${BlockType.MARKUP_IMAGE}"] {
    cursor: default;
  }

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

const CanvasContainer: React.FC<ConnectedCanvasContainerProps> = ({ undoHistory, redoHistory, children, prototypeStatus, isCanvasHidden }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const engine = React.useContext(EngineContext)!;
  const markup = React.useContext(MarkupContext)!;
  const clipboard = React.useContext(ClipboardContext)!;
  const spotlight = React.useContext(SpotlightContext)!;
  const isCommentingMode = useCommentingMode();
  const isEditingMode = useEditingMode();
  const isPrototypingMode = usePrototypingMode();

  const activeModal = useActiveModal();

  const canDelete = isEditingMode && !activeModal;
  const disableSpotlight = !isEditingMode || !!activeModal;

  const showSpotlight = React.useCallback(() => !disableSpotlight && spotlight.toggle(), [disableSpotlight]);
  const deleteActive = React.useCallback<VoidFunction>(() => canDelete && engine.removeActive(), [canDelete]);

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

  useRegistration(() => engine.register('container', api), [api]);

  useHotKeys(Hotkey.COPY, () => clipboard.copy(), { preventDefault: true });
  useHotKeys(Hotkey.DELETE, deleteActive, { preventDefault: true }, [deleteActive]);
  useHotKeys(Hotkey.UNDO, undoHistory as VoidFunction, { preventDefault: true });
  useHotKeys(Hotkey.REDO, redoHistory as VoidFunction, { preventDefault: true });
  useHotKeys(Hotkey.SPOTLIGHT, showSpotlight, { action: 'keyup', preventDefault: true }, [showSpotlight]);
  useHotKeys(Hotkey.DUPLICATE, onDuplicate, { preventDefault: true });

  return (
    <Wrapper
      id={Identifier.CANVAS_CONTAINER}
      ref={ref}
      className={cn({
        [CANVAS_HIDDEN_CLASSNAME]: isCanvasHidden,
        [CANVAS_MARKUP_CREATING_CLASSNAME]: !!markup.creatingType,
        [CANVAS_PROTOTYPE_ENABLED_CLASSNAME]: isPrototypingMode,
        [CANVAS_PROTOTYPE_RUNNING_CLASSNAME]: prototypeStatus === Prototype.PrototypeStatus.ACTIVE,
        [CANVAS_COMMENTING_ENABLED_CLASSNAME]: isCommentingMode,
      })}
      data-markup-creating-type={markup.creatingType}
    >
      {children}
    </Wrapper>
  );
};

const mapStateToProps = {
  isCanvasHidden: Creator.isHiddenSelector,
  prototypeStatus: Prototype.prototypeStatusSelector,
};

const mapDispatchToProps = {
  undoHistory: Creator.undoHistory,
  redoHistory: Creator.redoHistory,
};

type ConnectedCanvasContainerProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(CanvasContainer) as React.FC;
