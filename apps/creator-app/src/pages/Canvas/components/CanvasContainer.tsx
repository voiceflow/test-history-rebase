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
import { useDispatch, useHotkeyList, useRegistration, useSelector } from '@/hooks';
import { getHotkeyLabel, Hotkey } from '@/keymap';
import * as ModalsV2 from '@/ModalsV2';
import { ClipboardContext, EngineContext, SpotlightContext } from '@/pages/Canvas/contexts';
import { CanvasContainerAPI } from '@/pages/Canvas/types';
import { MarkupContext, SelectionSetTargetsContext } from '@/pages/Project/contexts';
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
  const search = React.useContext(SearchContext);
  const engine = React.useContext(EngineContext)!;
  const markup = React.useContext(MarkupContext)!;
  const clipboard = React.useContext(ClipboardContext)!;
  const spotlight = React.useContext(SpotlightContext)!;
  const [hotkeysState] = React.useContext(HotkeysContext)!;
  const manualSaveModal = ModalsV2.useModal(ModalsV2.Project.ManualSaveVersion);
  const setSelectedTargets = React.useContext(SelectionSetTargetsContext);

  const isEditingMode = useEditingMode();
  const activeModalID = ModalsV2.useActiveModalID();
  const isCommentingMode = useCommentingMode();
  const isPrototypingMode = usePrototypingMode();

  const onUndo = useDispatch(History.undo);
  const onRedo = useDispatch(History.redo);

  const prototypeStatus = useSelector(Prototype.prototypeStatusSelector);

  const onSearch = () => search?.toggle();
  const onDelete = () => engine.removeActive();
  const onSpotlight = () => spotlight.toggle();

  const onCut = async () => {
    await clipboard.copy(null, { disableSuccessToast: true });

    await engine.removeActive();
  };

  const onCopy = () => clipboard.copy();

  const onSave = (event: KeyboardEvent) => {
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
  };

  const onDuplicate = async () => {
    const targets = engine.activation.getTargets();

    if (!targets.length) return;

    if (targets.length === 1) {
      engine.node.api(targets[0])?.instance?.blur?.();
    }

    await engine.node.duplicateMany(targets);
  };

  const onSelectAll = () => engine.selectAll();

  const onCreateComponent = async () => {
    if (!engine.activation.getTargets().length) return;

    await engine.createComponent();

    setSelectedTargets([]);
  };

  const onCreateSubtopic = async () => {
    if (!engine.activation.getTargets().length) return;

    await engine.createSubtopic();

    setSelectedTargets([]);
  };

  const disableCanvasHotkeys = !isEditingMode || !!activeModalID;
  const deleteDisabled = disableCanvasHotkeys || !!hotkeysState.disableCanvasNodeDelete.length;

  useHotkeyList(
    [
      { hotkey: Hotkey.CUT, callback: onCut, disable: disableCanvasHotkeys, preventDefault: true },
      { hotkey: Hotkey.COPY, callback: onCopy, disable: disableCanvasHotkeys, preventDefault: true },
      { hotkey: Hotkey.SAVE, callback: onSave, preventDefault: true },
      { hotkey: Hotkey.UNDO, callback: onUndo, disable: disableCanvasHotkeys, preventDefault: true },
      { hotkey: Hotkey.REDO, callback: onRedo, disable: disableCanvasHotkeys, preventDefault: true },
      { hotkey: Hotkey.DELETE, callback: onDelete, disable: deleteDisabled, preventDefault: true },
      { hotkey: Hotkey.SEARCH, callback: onSearch, preventDefault: true },
      { hotkey: Hotkey.SPOTLIGHT, callback: onSpotlight, action: 'keyup', disable: disableCanvasHotkeys, preventDefault: true },
      { hotkey: Hotkey.DUPLICATE, callback: onDuplicate, disable: disableCanvasHotkeys, preventDefault: true },
      { hotkey: Hotkey.SELECT_ALL, callback: onSelectAll, preventDefault: true },
      { hotkey: Hotkey.NATIVE_SEARCH, callback: onSearch, preventDefault: true },
      { hotkey: Hotkey.CREATE_SUBTOPIC, callback: onCreateSubtopic, disable: disableCanvasHotkeys, preventDefault: true },
      { hotkey: Hotkey.CREATE_COMPONENT, callback: onCreateComponent, disable: disableCanvasHotkeys, preventDefault: true },
    ],
    [disableCanvasHotkeys, deleteDisabled]
  );

  const api = React.useMemo<CanvasContainerAPI>(
    () => ({
      addClass: (className) => ref.current?.classList.add(className),
      removeClass: (className) => ref.current?.classList.remove(className),
    }),
    []
  );

  useRegistration(() => engine.register('container', api), [api]);

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
