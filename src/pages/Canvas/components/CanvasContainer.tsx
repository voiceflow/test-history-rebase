import React from 'react';

import { isSafari } from '@/config';
import { BlockType, MarkupModeType } from '@/constants';
import * as Creator from '@/ducks/creator';
import { connect, css, styled } from '@/hocs';
import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { ClipboardContext, EngineContext, SpotlightContext } from '@/pages/Canvas/contexts';
import { EditPermissionContext, MarkupModeContext } from '@/pages/Skill/contexts';
import { Callback, ConnectedProps } from '@/types';

export const MARKUP_MODE_CURSORS: Record<MarkupModeType, string> = {
  [MarkupModeType.TEXT]: 'text',
  [MarkupModeType.SQUARE]: 'crosshair',
  [MarkupModeType.CIRCLE]: 'crosshair',
  [MarkupModeType.LINE]: 'crosshair',
  [MarkupModeType.ARROW]: 'crosshair',
  [MarkupModeType.IMAGE]: 'default',
};

const Wrapper = styled.div<{ markupMode: MarkupModeType | null; isMarkupCreating: boolean }>`
  width: ${isSafari ? '100vw' : '100%'};
  height: ${isSafari ? 'calc(100vh - 120px)' : '100%'};
  overflow: hidden;

  ${({ markupMode, isMarkupCreating }) =>
    markupMode &&
    isMarkupCreating &&
    css`
      cursor: ${MARKUP_MODE_CURSORS[markupMode]};
    `}
`;

const CanvasContainer: React.FC<ConnectedCanvasContainerProps> = ({ undoHistory, redoHistory, children }) => {
  const { canEdit } = React.useContext(EditPermissionContext)!;
  const engine = React.useContext(EngineContext)!;
  const clipboard = React.useContext(ClipboardContext)!;
  const spotlight = React.useContext(SpotlightContext)!;
  const { isCreating: isMarkupCreating, modeType: markupModeType } = React.useContext(MarkupModeContext)!;

  const showSpotlight = React.useCallback(() => canEdit && spotlight.toggle(), [canEdit]);
  const deleteActive = React.useCallback<Callback>(() => canEdit && engine.removeActive(), [canEdit]);
  const addComment = React.useCallback<Callback>(async () => {
    const position = engine.getCanvasMousePosition();

    await engine.node.add(BlockType.COMMENT, position);
  }, []);

  useHotKeys(Hotkey.COPY, () => clipboard.copy(), { preventDefault: true });
  useHotKeys(Hotkey.DELETE, deleteActive, { preventDefault: true }, [deleteActive]);
  useHotKeys(Hotkey.UNDO, undoHistory as Callback, { preventDefault: true });
  useHotKeys(Hotkey.REDO, redoHistory as Callback, { preventDefault: true });
  useHotKeys(Hotkey.COMMENT, addComment, { preventDefault: true });
  useHotKeys(Hotkey.SPOTLIGHT, showSpotlight, { preventDefault: true }, [showSpotlight]);

  return (
    <Wrapper markupMode={markupModeType} isMarkupCreating={isMarkupCreating}>
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
