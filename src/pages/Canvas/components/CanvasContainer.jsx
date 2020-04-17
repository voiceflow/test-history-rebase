import cuid from 'cuid';
import React from 'react';

import { isSafari } from '@/config';
import { BlockType } from '@/constants';
import { MousePositionContext } from '@/contexts';
import * as Creator from '@/ducks/creator';
import { connect, styled } from '@/hocs';
import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { ClipboardContext, EditPermissionContext, EngineContext, SpotlightContext } from '@/pages/Canvas/contexts';

const Wrapper = styled.div`
  width: ${isSafari ? '100vw' : '100%'};
  height: ${isSafari ? 'calc(100vh - 120px)' : '100%'};
  overflow: hidden;
`;

function CanvasContainer({ undoHistory, redoHistory, children }) {
  const { canEdit } = React.useContext(EditPermissionContext);
  const engine = React.useContext(EngineContext);
  const mousePosition = React.useContext(MousePositionContext);
  const clipboard = React.useContext(ClipboardContext);
  const spotlight = React.useContext(SpotlightContext);

  const showSpotlight = React.useCallback(() => canEdit && spotlight.toggle(), [canEdit]);
  const deleteActive = React.useCallback(() => canEdit && engine.removeActive(), [canEdit]);
  const addComment = React.useCallback(async () => {
    const position = engine.canvas.transformPoint(mousePosition.current);

    await engine.node.add(cuid(), BlockType.COMMENT, position);
  }, []);

  useHotKeys(Hotkey.COPY, () => clipboard.copy(), { preventDefault: true });
  useHotKeys(Hotkey.DELETE, deleteActive, { preventDefault: true }, [deleteActive]);
  useHotKeys(Hotkey.UNDO, undoHistory, { preventDefault: true });
  useHotKeys(Hotkey.REDO, redoHistory, { preventDefault: true });
  useHotKeys(Hotkey.COMMENT, addComment, { preventDefault: true });
  useHotKeys(Hotkey.SPOTLIGHT, showSpotlight, { preventDefault: true }, [showSpotlight]);

  return <Wrapper>{children}</Wrapper>;
}

const mapDispatchToProps = {
  undoHistory: Creator.undoHistory,
  redoHistory: Creator.redoHistory,
};

export default connect(null, mapDispatchToProps)(CanvasContainer);
