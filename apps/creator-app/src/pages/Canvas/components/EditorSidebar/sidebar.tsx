/* eslint-disable no-nested-ternary */
import * as Realtime from '@voiceflow/realtime-sdk';
import { stopImmediatePropagation } from '@voiceflow/ui';
import React from 'react';

import Drawer from '@/components/Drawer';
import { BlockType } from '@/constants';
import { NamespaceProvider } from '@/contexts/NamespaceContext';
import { UI } from '@/ducks';
import * as CreatorV2 from '@/ducks/creatorV2';
import { useActiveProjectConfig, useHideVoiceflowAssistant, useRAF, useTheme } from '@/hooks';
import { useSelector } from '@/hooks/store.hook';
import { LockedBlockOverlay } from '@/pages/Canvas/components/LockedEditorOverlay';
import { EngineContext, ManagerContext } from '@/pages/Canvas/contexts';
import BlockEditor from '@/pages/Canvas/editors/BlockEditor';
import MarkupEditor from '@/pages/Canvas/editors/MarkupEditor';
import { NodeEditor } from '@/pages/Canvas/managers/types';
import { useEditingMode } from '@/pages/Project/hooks';
import { isMarkupBlockType } from '@/utils/typeGuards';

import EditorModal from '../EditorModal';
import { SidebarHeaderAction, SidebarProvider } from './contexts';
import { useEditorPath, useUpdateData } from './hooks';

const UNEDITABLE_BLOCKS = new Set<Realtime.BlockType>([...Realtime.MARKUP_MEDIA_NODES]);
const EMPTY_HEADER_ACTIONS: SidebarHeaderAction[] = [];

const FOCUSED_NODE_SIDEBAR_OFFSET = 20;

// eslint-disable-next-line sonarjs/cognitive-complexity
const EditSidebar = () => {
  const theme = useTheme();

  const data = useSelector(CreatorV2.focusedNodeDataSelector);
  const focus = useSelector(CreatorV2.creatorFocusSelector);
  const getNodeByID = useSelector(CreatorV2.getNodeByIDSelector);
  const isCanvasOnly = useSelector(UI.selectors.isCanvasOnly);

  const engine = React.useContext(EngineContext)!;
  const getManager = React.useContext(ManagerContext)!;
  const { nlu, platform, projectType } = useActiveProjectConfig();

  const prevPathLength = React.useRef(0);
  const prevAnimationDistance = React.useRef(40);

  const [fullScreen, setFullScreen] = React.useState(false);

  const isEditingMode = useEditingMode();
  const { node, path, goToPath, pushToPath, popFromPath } = useEditorPath();

  const [canvasPositionScheduler] = useRAF();

  const updateData = useUpdateData(node?.id);
  const onRename = React.useCallback((name: string) => updateData({ name }), [updateData]);

  const isMarkup = !!node && isMarkupBlockType(node.type);
  const shouldRender = !!data && !!node && !UNEDITABLE_BLOCKS.has(node.type);
  const isOpen = isEditingMode && shouldRender && focus.isActive && !fullScreen;
  const blocKID = node?.parentNode ?? node?.id;

  React.useEffect(() => {
    const block = getNodeByID({ id: blocKID });
    const { canvas } = engine;

    if (!isOpen || !block || !canvas || Realtime.Utils.typeGuards.isMarkupBlockType(block.type)) return;

    const offset = FOCUSED_NODE_SIDEBAR_OFFSET / canvas.getZoom();
    const canvasPosition = canvas.getPosition();
    const canvasRect = canvas.getRect();
    const canvasEndX = canvasRect.width - theme.components.blockSidebar.width;
    const [blockEndX] = canvas
      .toCoords([block.x, block.y])
      .add([offset + theme.components.block.width / 2, 0])
      .raw();

    if (blockEndX > canvasEndX) {
      canvasPositionScheduler(() => {
        canvas.applyTransition();
        canvas.setPosition([canvasPosition[0] - (blockEndX - canvasEndX), canvasPosition[1]]);
      });
    }
  }, [isOpen, blocKID]);

  useHideVoiceflowAssistant({ hide: isOpen || fullScreen });

  let editor = null;

  if (shouldRender) {
    const { editorsByPath, editor: rootEditor, platforms = [], projectTypes = [] } = getManager(node.type);
    const activePath = path[path.length - 1] || { label: '' };

    const subManager = activePath.type ? editorsByPath?.[activePath.type] ?? null : null;
    let Manager: NodeEditor<any, any> | null = subManager || rootEditor || null;

    if (
      (platforms.length && !platforms.includes(platform)) ||
      (projectTypes.length && !projectTypes.includes(projectType))
    ) {
      Manager = getManager(BlockType.INVALID_PLATFORM).editor;
    }

    prevAnimationDistance.current =
      prevPathLength.current < path.length
        ? 40
        : prevPathLength.current > path.length
          ? -40
          : prevAnimationDistance.current;

    const managerEl = Manager && (
      <Manager
        data={data}
        node={node}
        engine={engine}
        isOpen={isOpen}
        nodeID={node.id}
        nluType={nlu}
        platform={platform}
        onChange={updateData}
        onExpand={() => setFullScreen(true)}
        expanded={fullScreen}
        goToPath={goToPath}
        activePath={activePath}
        pushToPath={pushToPath}
        projectType={projectType}
        popFromPath={popFromPath}
      />
    );

    if (isMarkup) {
      editor = (
        <NamespaceProvider value={['editor', node.type, node.id]}>
          <MarkupEditor key={node.id} animationDistance={prevAnimationDistance.current}>
            {managerEl}
          </MarkupEditor>

          <LockedBlockOverlay nodeID={node.id} disabled={!isOpen && !fullScreen} />
        </NamespaceProvider>
      );
    } else {
      editor = (
        <NamespaceProvider value={['editor', node.type, node.id]}>
          <BlockEditor
            key={`${node.id}-${path.length}`}
            path={path}
            goToPath={goToPath}
            onRename={onRename}
            hideHeader={fullScreen}
            animationDistance={prevAnimationDistance.current}
          >
            {managerEl}
          </BlockEditor>

          <LockedBlockOverlay nodeID={node.id} disabled={!isOpen && !fullScreen} />
        </NamespaceProvider>
      );
    }

    if (prevPathLength.current !== path.length) {
      prevPathLength.current = path.length;
    }
  }

  return (
    <SidebarProvider headerActions={node?.type === BlockType.START ? EMPTY_HEADER_ACTIONS : undefined}>
      <Drawer
        key={focus.target ?? undefined} // required to fix layout issue - key cannot be `null` so change it to `undefined` if it is
        open={isOpen}
        overflowHidden
        width={isMarkup ? theme.components.markupSidebar.width : theme.components.blockSidebar.width}
        onPaste={stopImmediatePropagation()}
        direction={Drawer.Direction.LEFT}
        disableAnimation={!shouldRender}
        style={{
          top: isCanvasOnly ? 0 : theme.components.header.newHeight,
          height: isCanvasOnly ? '100%' : `calc(100% - ${theme.components.header.newHeight}px)`,
        }}
      >
        {!fullScreen && !!path.length && editor}
      </Drawer>

      {fullScreen && <EditorModal onClose={() => setFullScreen(false)}>{editor}</EditorModal>}
    </SidebarProvider>
  );
};

export default React.memo(EditSidebar);
