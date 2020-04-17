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
import { preventDefault } from '@/utils/dom';

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

  useHotKeys(
    Hotkey.COPY,
    preventDefault(() => clipboard.copy())
  );
  useHotKeys(Hotkey.DELETE, preventDefault(deleteActive), [deleteActive]);
  useHotKeys(Hotkey.UNDO, preventDefault(undoHistory));
  useHotKeys(Hotkey.REDO, preventDefault(redoHistory));
  useHotKeys(Hotkey.COMMENT, preventDefault(addComment));
  useHotKeys(Hotkey.SPOTLIGHT, preventDefault(showSpotlight), [showSpotlight]);

  return <Wrapper>{children}</Wrapper>;
}

const mapDispatchToProps = {
  undoHistory: Creator.undoHistory,
  redoHistory: Creator.redoHistory,
};

export default connect(null, mapDispatchToProps)(CanvasContainer);
