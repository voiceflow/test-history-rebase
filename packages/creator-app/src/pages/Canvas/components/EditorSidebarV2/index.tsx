import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { CustomScrollbarsTypes, stopImmediatePropagation } from '@voiceflow/ui';
import React from 'react';
import type { ExtractRouteParams } from 'react-router';
import { generatePath, useRouteMatch } from 'react-router-dom';

import Drawer from '@/components/Drawer';
import { Path } from '@/config/routes';
import { BlockType } from '@/constants';
import { NamespaceProvider } from '@/contexts';
import * as Creator from '@/ducks/creator';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as Router from '@/ducks/router';
import { useDispatch, useSelector, useTheme, useToggle } from '@/hooks';
import { EngineContext, ManagerContext } from '@/pages/Canvas/contexts';
import { PlatformContext, ProjectTypeContext } from '@/pages/Project/contexts';
import { useEditingMode } from '@/pages/Project/hooks';

import { EditorAnimationEffect } from '../../constants';
import { NodeEditorV2Props } from '../../managers/types';
import { LockedBlockOverlay } from '../LockedEditorOverlay';
import { EditorSidebarProvider } from './context';
import { useUseAutopanBlockIntoView } from './hooks';

export { EditorSidebarContext } from './context';

const EditorSidebarV2 = () => {
  const theme = useTheme();
  const isEditingMode = useEditingMode();

  const scrollbars = React.useRef<CustomScrollbarsTypes.Scrollbars>(null);

  const engine = React.useContext(EngineContext)!;
  const platform = React.useContext(PlatformContext)!;
  const getManager = React.useContext(ManagerContext)!;
  const projectType = React.useContext(ProjectTypeContext)!;

  const node = useSelector(Creator.focusedNodeSelector);
  const data = useSelector(Creator.focusedNodeDataSelector);
  const focus = useSelector(Creator.creatorFocusSelector);
  const parentNodeData = useSelector(CreatorV2.nodeDataByIDSelector, { id: node?.parentNode }) as Nullable<
    Realtime.NodeData<Realtime.NodeData.Combined>
  >;

  const [isFullscreen, toggleFullscreen] = useToggle(false);

  const goToNode = useDispatch(Router.goToCurrentCanvasNode);

  const onChange = React.useCallback(
    (value: Partial<Realtime.NodeData<{}>>) => (node?.id ? engine.node.updateData(node.id, value) : Promise.resolve()),
    [engine.node, node?.id]
  );

  const onParentChange = React.useCallback(
    (value: Partial<Realtime.NodeData<Realtime.NodeData.Combined>>) =>
      node?.parentNode ? engine.node.updateData(node.parentNode, value) : Promise.resolve(),
    [engine.node, node?.parentNode]
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
    <S extends string>(
      configOrPath: S | { path: S; params?: ExtractRouteParams<S>; animationEffect?: EditorAnimationEffect; state?: Record<string, unknown> }
    ) => {
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
      isRoot: !!routeMatch?.isExact,
      goBack,
      isOpened,
      platform,
      onChange,
      goToRoot,
      goToNested,
      scrollbars,
      projectType,
      isFullscreen,
      parentNodeData,
      onParentChange,
      onToggleFullscreen: toggleFullscreen,
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
