import cn from 'classnames';
import React from 'react';

import Drawer from '@/components/Drawer';
import { isSafari } from '@/config';
import { MarkupModeType } from '@/constants';
import * as Creator from '@/ducks/creator';
import { connect, css, styled } from '@/hocs';
import { useActiveModal, useHotKeys, useRegistration } from '@/hooks';
import { Hotkey } from '@/keymap';
import { ClipboardContext, EngineContext, SpotlightContext } from '@/pages/Canvas/contexts';
import { CanvasContainerAPI } from '@/pages/Canvas/types';
import { MarkupModeContext } from '@/pages/Skill/contexts';
import { useCommentingMode, useEditingMode, useMarkupMode } from '@/pages/Skill/hooks';
import { Identifier } from '@/styles/constants';
import { Callback, ConnectedProps } from '@/types';

import {
  CANVAS_COMMENTING_ENABLED_CLASSNAME,
  CANVAS_MARKUP_CREATING_CLASSNAME,
  CANVAS_MARKUP_ENABLED_CLASSNAME,
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

const CanvasContainer: React.FC<ConnectedCanvasContainerProps> = ({ undoHistory, redoHistory, children }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const engine = React.useContext(EngineContext)!;
  const clipboard = React.useContext(ClipboardContext)!;
  const spotlight = React.useContext(SpotlightContext)!;
  const { isCreating: isMarkupCreating, modeType: markupModeType } = React.useContext(MarkupModeContext)!;
  const isCommentingMode = useCommentingMode();
  const isMarkupMode = useMarkupMode();
  const isEditingMode = useEditingMode();

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
        [CANVAS_MARKUP_ENABLED_CLASSNAME]: isMarkupMode,
        [CANVAS_MARKUP_CREATING_CLASSNAME]: isMarkupCreating,
      })}
      markupMode={markupModeType}
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
