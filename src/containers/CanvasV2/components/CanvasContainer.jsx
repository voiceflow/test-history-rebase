import cuid from 'cuid';
import React from 'react';

import { isSafari } from '@/config';
import { BlockType } from '@/constants';
import { ClipboardContext, EngineContext, SpotlightContext, TestingModeContext } from '@/containers/CanvasV2/contexts';
import { MousePositionContext } from '@/contexts';
import * as Creator from '@/ducks/creator';
import { setActiveCreatorMenu } from '@/ducks/ui';
import { connect, styled } from '@/hocs';
import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { preventDefault } from '@/utils/dom';

import { PanelType } from './CanvasMenu/constants';

const Wrapper = styled.div`
  width: ${isSafari ? '100vw' : '100%'};
  height: ${isSafari ? 'calc(100vh - 120px)' : '100%'};
  overflow: hidden;
`;

function CanvasContainer({ openMenu, undoHistory, redoHistory, children }) {
  const isTesting = React.useContext(TestingModeContext);
  const engine = React.useContext(EngineContext);
  const mousePosition = React.useContext(MousePositionContext);
  const clipboard = React.useContext(ClipboardContext);
  const spotlight = React.useContext(SpotlightContext);

  const showSpotlight = React.useCallback(() => !isTesting && spotlight.toggle(), [isTesting]);
  const deleteActive = React.useCallback(() => !isTesting && engine.removeActive(), [isTesting]);
  const addComment = React.useCallback(() => {
    const position = engine.canvas.transformPoint(mousePosition.current);

    engine.node.add(cuid(), BlockType.COMMENT, position);
  }, []);

  useHotKeys(Hotkey.COPY, preventDefault(() => clipboard.copy()), []);
  useHotKeys(Hotkey.DELETE, preventDefault(deleteActive), [deleteActive]);
  useHotKeys(Hotkey.UNDO, preventDefault(undoHistory), []);
  useHotKeys(Hotkey.REDO, preventDefault(redoHistory), []);
  useHotKeys(Hotkey.COMMENT, addComment, []);
  useHotKeys(Hotkey.SPOTLIGHT, preventDefault(showSpotlight), [showSpotlight]);
  useHotKeys(Hotkey.OPEN_BLOCK_MENU, () => openMenu(PanelType.BLOCK_PANEL), []);
  useHotKeys(Hotkey.OPEN_FLOW_MENU, () => openMenu(PanelType.FLOW_PANEL), []);
  useHotKeys(Hotkey.OPEN_VARIABLE_MENU, () => openMenu(PanelType.VARIABLE_PANEL), []);

  return <Wrapper>{children}</Wrapper>;
}

const mapDispatchToProps = {
  openMenu: setActiveCreatorMenu,
  undoHistory: Creator.undoHistory,
  redoHistory: Creator.redoHistory,
};

export default connect(
  null,
  mapDispatchToProps
)(CanvasContainer);
