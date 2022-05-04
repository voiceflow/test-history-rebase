import * as Realtime from '@voiceflow/realtime-sdk';
import { stopImmediatePropagation } from '@voiceflow/ui';
import React from 'react';
import { ExtractRouteParams } from 'react-router';
import { generatePath, useRouteMatch } from 'react-router-dom';

import { Scrollbars } from '@/components/CustomScrollbars';
import Drawer from '@/components/Drawer';
import { RemoveIntercom } from '@/components/IntercomChat';
import { Path } from '@/config/routes';
import { BlockType, ModalType } from '@/constants';
import { NamespaceProvider } from '@/contexts';
import * as Creator from '@/ducks/creator';
import * as Router from '@/ducks/router';
import { useDispatch, useModals, useSelector, useTheme } from '@/hooks';
import { EngineContext, ManagerContext } from '@/pages/Canvas/contexts';
import { PlatformContext, ProjectTypeContext } from '@/pages/Project/contexts';
import { useEditingMode } from '@/pages/Project/hooks';

import { EditorAnimationEffect } from '../../constants';
import EditorModal from '../EditorModal';
import { LockedBlockOverlay } from '../LockedEditorOverlay';
import { EditorSidebarProvider } from './context';
import { useUseAutopanBlockIntoView } from './hooks';

export { EditorSidebarContext } from './context';

const EditorSidebarV2 = () => {
  const theme = useTheme();
  const editorModal = useModals(ModalType.FULLSCREEN_EDITOR);
  const isEditingMode = useEditingMode();

  const scrollbars = React.useRef<Scrollbars>(null);

  const engine = React.useContext(EngineContext)!;
  const platform = React.useContext(PlatformContext)!;
  const getManager = React.useContext(ManagerContext)!;
  const projectType = React.useContext(ProjectTypeContext)!;

  const node = useSelector(Creator.focusedNodeSelector);
  const data = useSelector(Creator.focusedNodeDataSelector);
  const focus = useSelector(Creator.creatorFocusSelector);

  const goToNode = useDispatch(Router.goToCurrentCanvasNode);

  const onChange = React.useCallback(
    (value: Partial<Realtime.NodeData<{}>>, save = true) => (node?.id ? engine.node.updateData(node.id, value, save) : Promise.resolve()),
    [engine.node, node?.id]
  );

  const routeMatch = useRouteMatch(Path.CANVAS_NODE);

  const goBack = React.useCallback(
    <S extends string>(configOrPath?: S | { path: S; params?: ExtractRouteParams<S> }) => {
      if (!node?.id) return;

      const routeState = { animationEffect: EditorAnimationEffect.POP };

      if (typeof configOrPath === 'string') {
        goToNode(node.id, configOrPath, routeState);
      } else if (configOrPath) {
        goToNode(node.id, generatePath(configOrPath.path, configOrPath.params), routeState);
      } else {
        goToNode(node.id, undefined, routeState);
      }
    },
    [goToNode, node?.id]
  );

  const goToRoot = React.useCallback(
    (animationEffect?: EditorAnimationEffect) => node?.id && goToNode(node.id, undefined, { animationEffect }),
    [node?.id, goToNode]
  );

  const goToNested = React.useCallback(
    <S extends string>(configOrPath: S | { path: S; params?: ExtractRouteParams<S>; animationEffect?: EditorAnimationEffect }) => {
      if (!node?.id) return;

      if (typeof configOrPath === 'string') {
        goToNode(node.id, configOrPath);
      } else {
        goToNode(node.id, generatePath(configOrPath.path, configOrPath.params), { animationEffect: configOrPath.animationEffect });
      }
    },
    [goToNode, node?.id]
  );

  const hasData = !!data && !!node;
  const blockID = node?.parentNode ?? node?.id ?? null;
  const isOpened = isEditingMode && focus.isActive && hasData;
  const isMarkup = !!node && Realtime.Utils.typeGuards.isMarkupBlockType(node.type);

  useUseAutopanBlockIntoView({ engine, blockID, isOpened });

  const getEditor = (node: Realtime.Node, data: Realtime.NodeData<{}>) => {
    let manager = getManager(node.type);

    const isInvalidPlatform =
      (manager.platforms?.length && !manager.platforms.includes(platform)) ||
      (manager.projectTypes?.length && !manager.projectTypes.includes(projectType));

    if (isInvalidPlatform) {
      manager = getManager(BlockType.INVALID_PLATFORM);
    }

    const Editor = manager.editorV2;

    if (!Editor) return null;

    const editorProps = {
      data: data as any,
      node: node as any,
      label: manager.label ?? '',
      engine,
      nodeID: node.id,
      isRoot: !!routeMatch?.isExact,
      goBack,
      isOpened,
      platform,
      onChange,
      goToRoot,
      onExpand: editorModal.open,
      isExpanded: editorModal.isOpened,
      goToNested,
      scrollbars,
      projectType,
    };

    return (
      <NamespaceProvider value={['editor', node.type, node.id]}>
        <EditorSidebarProvider value={editorProps}>
          <Editor {...editorProps} />

          <LockedBlockOverlay nodeID={node.id} disabled={!isOpened} />
        </EditorSidebarProvider>
      </NamespaceProvider>
    );
  };

  const width = isMarkup ? theme.components.markupSidebar.width : theme.components.blockSidebar.width;

  return (
    <React.Fragment key={focus.target ?? 'unknown'}>
      {editorModal.isOpened && isOpened ? (
        <EditorModal editor={hasData && getEditor(node, data)} />
      ) : (
        <Drawer
          open={isOpened}
          width={width}
          onPaste={stopImmediatePropagation()}
          direction={Drawer.Direction.LEFT}
          overflowHidden
          disableAnimation={!hasData}
        >
          {hasData && getEditor(node, data)}
        </Drawer>
      )}

      {isOpened && <RemoveIntercom />}
    </React.Fragment>
  );
};

export default React.memo(EditorSidebarV2);
