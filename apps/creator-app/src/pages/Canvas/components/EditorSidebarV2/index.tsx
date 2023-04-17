import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { CustomScrollbarsTypes, stopImmediatePropagation } from '@voiceflow/ui';
import React from 'react';
import type { ExtractRouteParams } from 'react-router';
import { generatePath, useLocation, useRouteMatch } from 'react-router-dom';

import Drawer from '@/components/Drawer';
import HideVoiceflowAssistant from '@/components/HideVoiceflowAssistant';
import { Path } from '@/config/routes';
import { BlockType } from '@/constants';
import { NamespaceProvider } from '@/contexts/NamespaceContext';
import * as Creator from '@/ducks/creator';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as Router from '@/ducks/router';
import { useActiveProjectConfig, useDispatch, useSelector, useTheme, useToggle } from '@/hooks';
import { EngineContext, ManagerContext } from '@/pages/Canvas/contexts';
import { useEditingMode } from '@/pages/Project/hooks';

import { EditorAnimationEffect } from '../../constants';
import { NodeEditorV2Props } from '../../managers/types';
import { LockedBlockOverlay } from '../LockedEditorOverlay';
import { EditorSidebarProvider } from './context';
import { useUseAutopanBlockIntoView } from './hooks';

export { EditorSidebarContext } from './context';

interface GoToTypes<S extends string> {
  path: S;
  params?: ExtractRouteParams<S>;
  animationEffect?: EditorAnimationEffect;
  state?: Record<string, unknown>;
}

const EditorSidebarV2 = () => {
  const theme = useTheme();
  const location = useLocation();
  const isEditingMode = useEditingMode();
  const canvasNodeRouteMatch = useRouteMatch(Path.CANVAS_NODE);

  const scrollbars = React.useRef<CustomScrollbarsTypes.Scrollbars>(null);

  const engine = React.useContext(EngineContext)!;
  const getManager = React.useContext(ManagerContext)!;
  const { platform, projectType } = useActiveProjectConfig();

  const node = useSelector(Creator.focusedNodeSelector);
  const data = useSelector(Creator.focusedNodeDataSelector);
  const focus = useSelector(Creator.creatorFocusSelector);
  const parentBlockData = useSelector(CreatorV2.nodeDataByIDSelector, { id: node?.parentNode }) as Nullable<
    Realtime.NodeData<Realtime.NodeData.Combined>
  >;

  const [isFullscreen, toggleFullscreen] = useToggle(false);

  const goToNode = useDispatch(Router.goToCurrentCanvasNode);

  const onChange = React.useCallback(
    (value: Partial<Realtime.NodeData<{}>>) => (node?.id ? engine.node.updateData(node.id, value) : Promise.resolve()),
    [engine.node, node?.id]
  );

  const onChangeParentBlock = React.useCallback(
    (value: Partial<Realtime.NodeData<Realtime.NodeData.Combined>>) =>
      node?.parentNode ? engine.node.updateData(node.parentNode, value) : Promise.resolve(),
    [engine.node, node?.parentNode]
  );

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

  const goToSibling = React.useCallback(
    <S extends string>(configOrPath: S | GoToTypes<S>) => {
      if (!node?.id) return;

      if (typeof configOrPath === 'string') {
        goToNode(node.id, configOrPath);
      } else {
        goToNode(node.id, generatePath(configOrPath.path, configOrPath.params), {
          animationEffect: configOrPath.animationEffect,
          ...configOrPath.state,
        });
      }
    },
    [goToNode, node?.id]
  );

  const goToNested = React.useCallback(
    <S extends string>(configOrPath: S | GoToTypes<S>) => {
      if (!node?.id || !canvasNodeRouteMatch) return;

      const parentPath = location.pathname.replace(canvasNodeRouteMatch.url, '');

      if (typeof configOrPath === 'string') {
        goToNode(node.id, parentPath ? `${parentPath}/${configOrPath}` : configOrPath);
      } else {
        const childPath = generatePath(configOrPath.path, configOrPath.params);

        goToNode(node.id, parentPath ? `${parentPath}/${childPath}` : childPath, {
          animationEffect: configOrPath.animationEffect,
          ...configOrPath.state,
        });
      }
    },
    [goToNode, node?.id, location.pathname]
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

    const editorProps: NodeEditorV2Props<any, any> = {
      data: data as any,
      node: node as any,
      label: manager.getDataLabel?.(data as any) ?? manager.label ?? '',
      engine,
      nodeID: node.id,
      isRoot: !!canvasNodeRouteMatch?.isExact,
      goBack,
      isOpened,
      platform,
      onChange,
      goToRoot,
      goToNested,
      scrollbars,
      goToSibling,
      projectType,
      isFullscreen,
      parentBlockData,
      onToggleFullscreen: toggleFullscreen,
      onChangeParentBlock,
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

  const editor = hasData && getEditor(node, data);

  React.useEffect(() => {
    if (!isOpened) {
      toggleFullscreen(false);
    }
  }, [isOpened]);

  return (
    <React.Fragment key={focus.target ?? 'unknown'}>
      {isOpened && <HideVoiceflowAssistant />}

      <Drawer
        open={isOpened}
        width={width}
        style={isOpened && isFullscreen ? { width: 'calc(100% - 355px' } : {}}
        onPaste={stopImmediatePropagation()}
        direction={Drawer.Direction.LEFT}
        animatedWidth
        overflowHidden
        disableAnimation={!hasData}
      >
        {editor}
      </Drawer>
    </React.Fragment>
  );
};

export default React.memo(EditorSidebarV2);
