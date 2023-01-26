import { IS_SAFARI, toast, ToastCallToAction } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';

import { BlockType } from '@/constants';
import { CANVAS_COLOR } from '@/constants/canvas';
import { PrototypeStatus } from '@/constants/prototype';
import { HotkeysContext } from '@/contexts/HotkeysContext';
import { SearchContext } from '@/contexts/SearchContext';
import * as History from '@/ducks/history';
import * as Prototype from '@/ducks/prototype';
import { styled } from '@/hocs/styled';
import { useActiveModal, useDispatch, useHotKeys, useRegistration, useSelector } from '@/hooks';
import { getHotkeyLabel, Hotkey } from '@/keymap';
import * as ModalsV2 from '@/ModalsV2';
import { ClipboardContext, EngineContext, SpotlightContext } from '@/pages/Canvas/contexts';
import { CanvasContainerAPI } from '@/pages/Canvas/types';
import { LastCreatedComponentContext, MarkupContext, SelectionSetTargetsContext } from '@/pages/Project/contexts';
import { useCommentingMode, useEditingMode, usePrototypingMode } from '@/pages/Project/hooks';
import { Identifier } from '@/styles/constants';

import {
  CANVAS_COMMENTING_ENABLED_CLASSNAME,
  CANVAS_MARKUP_CREATING_CLASSNAME,
  CANVAS_PROTOTYPE_ENABLED_CLASSNAME,
  CANVAS_PROTOTYPE_RUNNING_CLASSNAME,
  CANVAS_THREAD_OPEN_CLASSNAME,
} from '../constants';

const Wrapper = styled.div`
  width: ${IS_SAFARI ? '100vw' : '100%'};
  height: ${({ theme }) => (IS_SAFARI ? `calc(100vh - ${theme.components.page.header.height}px)` : '100%')};
  overflow: hidden;
  overflow: clip;
  background-color: ${CANVAS_COLOR};

  &.${CANVAS_MARKUP_CREATING_CLASSNAME}[data-markup-creating-type="${BlockType.MARKUP_TEXT}"] {
    cursor: text;
  }

  &.${CANVAS_MARKUP_CREATING_CLASSNAME}[data-markup-creating-type="${BlockType.MARKUP_IMAGE}"] {
    cursor: default;
  }

  &.${CANVAS_MARKUP_CREATING_CLASSNAME}[data-markup-creating-type="${BlockType.MARKUP_VIDEO}"] {
    cursor: default;
  }

  &.${CANVAS_COMMENTING_ENABLED_CLASSNAME} {
    cursor: crosshair;
  }

  &.${CANVAS_COMMENTING_ENABLED_CLASSNAME}.${CANVAS_THREAD_OPEN_CLASSNAME} {
    cursor: default;
  }
`;

const CanvasContainer: React.FC<React.PropsWithChildren> = ({ children }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const engine = React.useContext(EngineContext)!;
  const markup = React.useContext(MarkupContext)!;
  const clipboard = React.useContext(ClipboardContext)!;
  const search = React.useContext(SearchContext);
  const spotlight = React.useContext(SpotlightContext)!;
  const [hotkeysState] = React.useContext(HotkeysContext)!;
  const setSelectedTargets = React.useContext(SelectionSetTargetsContext);
  const lastCreatedComponent = React.useContext(LastCreatedComponentContext)!;
  const manualSaveModal = ModalsV2.useModal(ModalsV2.Project.ManualSave);
  const activeModal = useActiveModal();

  const isEditingMode = useEditingMode();
  const isCommentingMode = useCommentingMode();
  const isPrototypingMode = usePrototypingMode();

  const undoHistory = useDispatch(History.undo);
  const redoHistory = useDispatch(History.redo);

  const prototypeStatus = useSelector(Prototype.prototypeStatusSelector);

  const canDelete = isEditingMode && !activeModal;
  const disableBar = !isEditingMode || !!activeModal;

  const showSpotlight = React.useCallback(() => !disableBar && spotlight.toggle(), [disableBar]);
  const showSearch = React.useCallback(() => !disableBar && search?.toggle(), [disableBar]);
  const deleteActive = React.useCallback<VoidFunction>(() => canDelete && engine.removeActive(), [canDelete]);
  const cutActive = React.useCallback<VoidFunction>(async () => {
    await clipboard.copy(null, { disableSuccessToast: true });

    if (canDelete) {
      await engine.removeActive();
    }
  }, [canDelete]);

  const api = React.useMemo<CanvasContainerAPI>(
    () => ({
      addClass: (className) => ref.current?.classList.add(className),
      removeClass: (className) => ref.current?.classList.remove(className),
    }),
    []
  );

  const onSave = React.useCallback((event: KeyboardEvent) => {
    if (event.shiftKey) return;

    const projectVersionsV2Message = (
      <>
        Voiceflow automatically saves your work.
        <br />
        If you want to create a manual version use the shortcut <b>Shift + {getHotkeyLabel(Hotkey.SAVE_VERSION)}</b>
        <br />
        <ToastCallToAction
          onClick={() => {
            manualSaveModal.openVoid({});
          }}
        >
          <br />
          Manually Save Version
        </ToastCallToAction>
      </>
    );

    toast.info(projectVersionsV2Message, { toastId: 'canvas-container-save-hotkey-info' });
  }, []);

  const onDuplicate = React.useCallback(async () => {
    const targets = engine.activation.getTargets();
    const nodeIDs = [...targets, ...engine.node.getAllLinkedOutActionsNodeIDs(targets)];

    if (nodeIDs.length === 1) {
      const nodeID = nodeIDs[0];

      engine.node.api(nodeID)?.instance?.blur?.();
      await engine.node.duplicate(nodeID);
    } else if (nodeIDs.length > 1) {
      await engine.node.duplicateMany(nodeIDs);
    }
  }, [isEditingMode]);

  const onCreateComponent = React.useCallback(async () => {
    if (engine.activation.getTargets().length > 1) {
      const diagramID = await engine.createComponent();

      lastCreatedComponent.setComponentID(diagramID);

      setSelectedTargets([]);
    }
  }, []);

  useRegistration(() => engine.register('container', api), [api]);

  useHotKeys(Hotkey.CUT, cutActive, { preventDefault: true }, [cutActive]);
  useHotKeys(Hotkey.COPY, () => clipboard.copy(), { preventDefault: true, disable: !isEditingMode }, [isEditingMode]);
  useHotKeys(Hotkey.DELETE, deleteActive, { disable: !!hotkeysState.disableCanvasNodeDelete.length, preventDefault: true }, [deleteActive]);
  useHotKeys(Hotkey.UNDO, undoHistory, { preventDefault: true });
  useHotKeys(Hotkey.REDO, redoHistory, { preventDefault: true });
  useHotKeys(Hotkey.SEARCH, showSearch, { preventDefault: true }, [showSearch]);
  useHotKeys(Hotkey.NATIVE_SEARCH, showSearch, { preventDefault: true }, [showSearch]);
  useHotKeys(Hotkey.SPOTLIGHT, showSpotlight, { action: 'keyup', preventDefault: true }, [showSpotlight]);
  useHotKeys(Hotkey.DUPLICATE, onDuplicate, { preventDefault: true, disable: !isEditingMode }, [isEditingMode]);
  useHotKeys(Hotkey.CREATE_COMPONENT, onCreateComponent, { preventDefault: true });
  useHotKeys(Hotkey.SAVE, onSave, { preventDefault: true });

  return (
    <Wrapper
      id={Identifier.CANVAS_CONTAINER}
      ref={ref}
      className={cn({
        [CANVAS_MARKUP_CREATING_CLASSNAME]: !!markup.creatingType,
        [CANVAS_PROTOTYPE_ENABLED_CLASSNAME]: isPrototypingMode,
        [CANVAS_PROTOTYPE_RUNNING_CLASSNAME]: prototypeStatus === PrototypeStatus.ACTIVE,
        [CANVAS_COMMENTING_ENABLED_CLASSNAME]: isCommentingMode,
      })}
      data-markup-creating-type={markup.creatingType}
    >
      {children}
    </Wrapper>
  );
};

export default CanvasContainer;
