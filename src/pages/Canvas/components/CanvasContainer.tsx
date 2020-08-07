import cn from 'classnames';
import React from 'react';

import Drawer from '@/components/Drawer';
import { isSafari } from '@/config';
import { MarkupModeType, MarkupShapeType } from '@/constants';
import * as Creator from '@/ducks/creator';
import { connect, css, styled } from '@/hocs';
import { useActiveModal, useHotKeys, useRegistration } from '@/hooks';
import { Hotkey } from '@/keymap';
import { ClipboardContext, EngineContext, SpotlightContext } from '@/pages/Canvas/contexts';
import { CanvasContainerAPI } from '@/pages/Canvas/types';
import { EditPermissionContext, MarkupModeContext } from '@/pages/Skill/contexts';
import { useCommentingMode } from '@/pages/Skill/hooks';
import { Identifier } from '@/styles/constants';
import { Callback, ConnectedProps } from '@/types';

import { CANVAS_COMMENTING_ENABLED_CLASSNAME, CANVAS_MARKUP_CREATING_CLASSNAME, CANVAS_MARKUP_ENABLED_CLASSNAME } from '../constants';

export const MARKUP_MODE_CURSORS: Record<MarkupModeType | MarkupShapeType, string> = {
  [MarkupModeType.TEXT]: 'text',
  [MarkupShapeType.RECTANGLE]: 'crosshair',
  [MarkupShapeType.CIRCLE]: 'crosshair',
  [MarkupShapeType.LINE]: 'crosshair',
  [MarkupShapeType.ARROW]: 'crosshair',
  [MarkupModeType.IMAGE]: 'default',
};

const Wrapper = styled.div<{ markupMode: MarkupModeType | MarkupShapeType | null; isMarkupCreating: boolean; isCommentingMode: boolean }>`
  width: ${isSafari ? '100vw' : '100%'};
  height: ${isSafari ? 'calc(100vh - 120px)' : '100%'};
  overflow: hidden;

  ${({ markupMode, isMarkupCreating }) =>
    markupMode &&
    isMarkupCreating &&
    css`
      cursor: ${MARKUP_MODE_CURSORS[markupMode]};
    `}

  ${({ isCommentingMode }) =>
    isCommentingMode &&
    css`
      cursor: crosshair;

      ${Drawer} {
        cursor: pointer;
      }
    `}
`;

const CanvasContainer: React.FC<ConnectedCanvasContainerProps> = ({ undoHistory, redoHistory, children }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { canEdit } = React.useContext(EditPermissionContext)!;
  const engine = React.useContext(EngineContext)!;
  const clipboard = React.useContext(ClipboardContext)!;
  const spotlight = React.useContext(SpotlightContext)!;
  const { isCreating: isMarkupCreating, modeType: markupModeType, isOpen: markupOpen } = React.useContext(MarkupModeContext)!;
  const isCommentingMode = useCommentingMode();

  const activeModal = useActiveModal();

  const canDelete = canEdit && !activeModal;
  const disableSpotlight = !canEdit || markupOpen || !!activeModal;

  const showSpotlight = React.useCallback(() => !disableSpotlight && spotlight.toggle(), [disableSpotlight]);
  const deleteActive = React.useCallback<Callback>(() => canDelete && engine.removeActive(), [canDelete]);

  const api = React.useMemo<CanvasContainerAPI>(
    () => ({
      addClass: (className) => ref.current?.classList.add(className),
      removeClass: (className) => ref.current?.classList.remove(className),
    }),
    []
  );

  useRegistration(() => engine.register('container', api), [api]);

  useHotKeys(Hotkey.COPY, () => clipboard.copy(), { preventDefault: true });
  useHotKeys(Hotkey.DELETE, deleteActive, { preventDefault: true }, [deleteActive]);
  useHotKeys(Hotkey.UNDO, undoHistory as Callback, { preventDefault: true });
  useHotKeys(Hotkey.REDO, redoHistory as Callback, { preventDefault: true });
  useHotKeys(Hotkey.SPOTLIGHT, showSpotlight, { preventDefault: true }, [showSpotlight]);

  return (
    <Wrapper
      id={Identifier.CANVAS_CONTAINER}
      className={cn({
        [CANVAS_COMMENTING_ENABLED_CLASSNAME]: isCommentingMode,
        [CANVAS_MARKUP_ENABLED_CLASSNAME]: markupOpen,
        [CANVAS_MARKUP_CREATING_CLASSNAME]: isMarkupCreating,
      })}
      markupMode={markupModeType}
      isMarkupCreating={isMarkupCreating}
      isCommentingMode={isCommentingMode}
      ref={ref}
    >
      {children}
    </Wrapper>
  );
};

const mapDispatchToProps = {
  undoHistory: Creator.undoHistory,
  redoHistory: Creator.redoHistory,
};

type ConnectedCanvasContainerProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(CanvasContainer);
