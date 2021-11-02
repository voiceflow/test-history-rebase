import { IS_SAFARI, toast } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';

import Drawer from '@/components/Drawer';
import { FeatureFlag } from '@/config/features';
import { BlockType } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as Prototype from '@/ducks/prototype';
import { connect, styled } from '@/hocs';
import { useActiveModal, useFeature, useHotKeys, useRegistration } from '@/hooks';
import { Hotkey } from '@/keymap';
import { ClipboardContext, EngineContext, SpotlightContext } from '@/pages/Canvas/contexts';
import { CanvasContainerAPI } from '@/pages/Canvas/types';
import { LastCreatedComponentContext, MarkupContext } from '@/pages/Project/contexts';
import { useCommentingMode, useEditingMode, usePrototypingMode } from '@/pages/Project/hooks';
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
  height: ${({ theme }) => (IS_SAFARI ? `calc(100vh - ${theme.components.projectPage.header.height}px)` : '100%')};
  overflow: hidden;
  overflow: clip;

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

const CanvasContainer: React.FC<ConnectedCanvasContainerProps> = ({ children, undoHistory, redoHistory, isCanvasHidden, prototypeStatus }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const engine = React.useContext(EngineContext)!;
  const markup = React.useContext(MarkupContext)!;
  const clipboard = React.useContext(ClipboardContext)!;
  const spotlight = React.useContext(SpotlightContext)!;
  const lastCreatedComponent = React.useContext(LastCreatedComponentContext)!;
  const projectVersionsEnabled = useFeature(FeatureFlag.PROJECT_VERSIONS)?.isEnabled;

  const isEditingMode = useEditingMode();
  const isCommentingMode = useCommentingMode();
  const isPrototypingMode = usePrototypingMode();

  const activeModal = useActiveModal();

  const canDelete = isEditingMode && !activeModal;
  const disableSpotlight = !isEditingMode || !!activeModal;

  const showSpotlight = React.useCallback(() => !disableSpotlight && spotlight.toggle(), [disableSpotlight]);
  const deleteActive = React.useCallback<VoidFunction>(() => canDelete && engine.removeActive(), [canDelete]);
  const cutActive = React.useCallback<VoidFunction>(async () => {
    await clipboard.copy(null, { disableSuccessToast: true });

    if (canDelete) {
      await engine.removeActive({ disableConfirmPrompt: true });
    }
  }, [canDelete]);

  const api = React.useMemo<CanvasContainerAPI>(
    () => ({
      addClass: (className) => ref.current?.classList.add(className),
      removeClass: (className) => ref.current?.classList.remove(className),
    }),
    []
  );

  const onSave = React.useCallback(() => {
    if (projectVersionsEnabled) return;
    toast.info('Voiceflow automatically saves your work', { toastId: 'canvas-container-save-hotkey-info' });
  }, []);

  const onDuplicate = React.useCallback(() => {
    const targets = engine.activation.getTargets();

    if (targets.length === 1) {
      const nodeID = targets[0];

      engine.node.api(nodeID)?.instance?.blur?.();
      engine.node.duplicate(nodeID);
    } else if (targets.length > 1) {
      engine.node.duplicateMany(targets);
    }
  }, []);

  const onCreateComponent = React.useCallback(async () => {
    if (engine.activation.getTargets().length > 1) {
      const diagramID = await engine.createComponent();

      lastCreatedComponent.setComponentID(diagramID);
    }
  }, []);

  useRegistration(() => engine.register('container', api), [api]);

  useHotKeys(Hotkey.CUT, cutActive, { preventDefault: true }, [cutActive]);
  useHotKeys(Hotkey.COPY, () => clipboard.copy(), { preventDefault: true });
  useHotKeys(Hotkey.DELETE, deleteActive, { preventDefault: true }, [deleteActive]);
  useHotKeys(Hotkey.UNDO, undoHistory as VoidFunction, { preventDefault: true });
  useHotKeys(Hotkey.REDO, redoHistory as VoidFunction, { preventDefault: true });
  useHotKeys(Hotkey.SPOTLIGHT, showSpotlight, { action: 'keyup', preventDefault: true }, [showSpotlight]);
  useHotKeys(Hotkey.DUPLICATE, onDuplicate, { preventDefault: true });
  useHotKeys(Hotkey.CREATE_COMPONENT, onCreateComponent, { preventDefault: true });
  useHotKeys(Hotkey.SAVE, onSave, { preventDefault: true });

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
