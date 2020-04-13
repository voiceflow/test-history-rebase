import cuid from 'cuid';
import React from 'react';

import { isSafari } from '@/config';
import { FeatureFlag } from '@/config/features';
import { BlockType } from '@/constants';
import { MousePositionContext } from '@/contexts';
import * as Creator from '@/ducks/creator';
import { setActiveCreatorMenu } from '@/ducks/ui';
import { connect, styled } from '@/hocs';
import { useFeature, useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { ClipboardContext, EditPermissionContext, EngineContext, SpotlightContext } from '@/pages/Canvas/contexts';

import { PanelType } from './CanvasMenu/constants';

const Wrapper = styled.div`
  width: ${isSafari ? '100vw' : '100%'};
  height: ${isSafari ? 'calc(100vh - 120px)' : '100%'};
  overflow: hidden;
`;

// TODO: Remove when new BLOCK_REDESIGN feature flag removed
const LegacyCanvasWrapper = ({ openMenu, children }) => {
  useHotKeys(Hotkey.OPEN_BLOCK_MENU, () => openMenu(PanelType.BLOCK_PANEL));
  useHotKeys(Hotkey.OPEN_FLOW_MENU, () => openMenu(PanelType.FLOW_PANEL));
  useHotKeys(Hotkey.OPEN_VARIABLE_MENU, () => openMenu(PanelType.VARIABLE_PANEL));

  return children;
};

function CanvasContainer({ openMenu, undoHistory, redoHistory, children }) {
  const { canEdit } = React.useContext(EditPermissionContext);
  const engine = React.useContext(EngineContext);
  const mousePosition = React.useContext(MousePositionContext);
  const clipboard = React.useContext(ClipboardContext);
  const spotlight = React.useContext(SpotlightContext);
  const blockRedesign = useFeature(FeatureFlag.BLOCK_REDESIGN);

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

  return <Wrapper>{blockRedesign.isEnabled ? children : <LegacyCanvasWrapper openMenu={openMenu}>{children}</LegacyCanvasWrapper>}</Wrapper>;
}

const mapDispatchToProps = {
  openMenu: setActiveCreatorMenu,
  undoHistory: Creator.undoHistory,
  redoHistory: Creator.redoHistory,
};

export default connect(null, mapDispatchToProps)(CanvasContainer);
