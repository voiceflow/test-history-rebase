import { BlockType } from '@voiceflow/realtime-sdk';
import * as Realtime from '@voiceflow/realtime-sdk';
import { clsx } from '@voiceflow/style';
import {
  DraggablePanel,
  ResizableSection,
  ResizableSectionHeader,
  TreeView,
  usePersistFunction,
} from '@voiceflow/ui-next';
import { IResizableSectionAPI } from '@voiceflow/ui-next/build/cjs/components/Section/ResizableSection/types';
import React, { memo, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { CMS_FLOW_LEARN_MORE, CMS_WORKFLOW_LEARN_MORE } from '@/constants/link.constant';
import { Permission } from '@/constants/permissions';
import { Creator, Designer, Diagram, Router, UI } from '@/ducks';
import { useEventualEngine } from '@/hooks/engine';
import { useFeature } from '@/hooks/feature';
import { useFlowCreateModal, useWorkflowCreateModal } from '@/hooks/modal.hook';
import { usePermission } from '@/hooks/permission';
import { useLocalStorageState } from '@/hooks/storage.hook';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { useCommentingMode } from '@/pages/Project/hooks';

import StepMenu from '../../StepMenu';
import { containerStyle } from './DiagramSidebar.css';
import {
  useFlowsTree,
  useRenderFlowItemContextMenu,
  useRenderWorkflowItemContextMenu,
  useWorkflowsTree,
} from './DiagramSidebar.hook';
import {
  DiagramSidebarAnyFlowMetadata,
  DiagramSidebarAnyWorkflowMetadata,
  DiagramSidebarFlowTreeData,
  DiagramSidebarWorkflowTreeData,
} from './DiagramSidebar.interface';
import { DiagramSidebarToolbar } from './DiagramSidebarToolbar.component';

export const DiagramSidebar = memo(() => {
  const referenceSystem = useFeature(Realtime.FeatureFlag.REFERENCE_SYSTEM);

  const params = useParams<{ nodeID?: string; diagramID?: string }>();
  const getEngine = useEventualEngine();
  const isCommenting = useCommentingMode();
  const flowCreateModal = useFlowCreateModal();
  const [canEditCanvas] = usePermission(Permission.PROJECT_CANVAS_UPDATE);
  const workflowCreateModal = useWorkflowCreateModal();

  const resizableSectionRef = useRef<IResizableSectionAPI>(null);

  const canvasOnly = useSelector(UI.selectors.isCanvasOnly);
  const sidebarWidth = useSelector(UI.selectors.canvasSidebarWidth);
  const sidebarVisible = useSelector(UI.selectors.canvasSidebarVisible);
  const activeDiagramID = useSelector(Creator.activeDiagramIDSelector);
  const activeDiagramIsTopic = useSelector(Diagram.active.isTopicSelector);
  const activeTriggerNodeResource = useSelector(Designer.Reference.selectors.triggerNodeResourceByNodeIDAndDiagramID, {
    nodeID: params.nodeID,
    diagramID: params.diagramID,
  });

  const activeSharedNode = useSelector(Diagram.sharedNodeByDiagramIDAndNodeIDSelector, {
    nodeID: params.nodeID,
    diagramID: params.diagramID,
  });

  const goToDiagram = useDispatch(Router.goToDiagramHistoryClear);
  const patchOneFlow = useDispatch(Designer.Flow.effect.patchOne);
  const patchOneFolder = useDispatch(Designer.Folder.effect.patchOne);
  const setSidebarWidth = useDispatch(UI.action.SetCanvasSidebarWidth);
  const patchOneWorkflow = useDispatch(Designer.Workflow.effect.patchOne);
  const toggleCanvasSidebar = useDispatch(UI.action.ToggleCanvasSidebar);

  const [flowsTree] = useFlowsTree();
  const [workflowsTree] = useWorkflowsTree();
  const renderFlowItemContextMenu = useRenderFlowItemContextMenu({ canEditCanvas });
  const renderWorkflowItemContextMenu = useRenderWorkflowItemContextMenu({ canEditCanvas });

  const [footerCollapsed, setFooterCollapsed] = useLocalStorageState('diagram-sidebar-footer-collapsed', false);

  const onWorkflowItemClick = usePersistFunction((item: DiagramSidebarWorkflowTreeData) => {
    const engine = getEngine();

    if (item.metaData.type === 'workflow') {
      if (activeDiagramID === item.metaData.diagramID) {
        engine?.focusHome();
      } else {
        goToDiagram(item.metaData.diagramID);
      }
    } else if (item.metaData.type === 'node') {
      if (activeDiagramID === item.metaData.diagramID) {
        engine?.focusNode(item.metaData.nodeID, { open: true });
      } else {
        goToDiagram(item.metaData.diagramID, item.metaData.nodeID);
      }
    }
  });

  const onFlowItemClick = usePersistFunction((item: DiagramSidebarFlowTreeData) => {
    const engine = getEngine();

    if (item.metaData.type === 'flow') {
      if (activeDiagramID === item.metaData.diagramID) {
        engine?.focusHome();
      } else {
        goToDiagram(item.metaData.diagramID);
      }
    }
  });

  const onWorkflowItemRename = usePersistFunction((item: DiagramSidebarWorkflowTreeData, newName: string) => {
    if (item.metaData.type === 'workflow') {
      patchOneWorkflow(item.metaData.id, { name: newName });
    } else if (item.metaData.type === 'folder') {
      patchOneFolder(item.metaData.id, { name: newName });
    }
  });

  const onFlowItemRename = usePersistFunction((item: DiagramSidebarFlowTreeData, newName: string) => {
    if (item.metaData.type === 'flow') {
      patchOneFlow(item.metaData.id, { name: newName });
    } else if (item.metaData.type === 'folder') {
      patchOneFolder(item.metaData.id, { name: newName });
    }
  });

  const diagramID = params.diagramID ?? activeDiagramID;
  const focusedSharedNodeID =
    activeSharedNode?.type === BlockType.INTENT ||
    activeSharedNode?.type === BlockType.TRIGGER ||
    activeSharedNode?.type === BlockType.START
      ? activeSharedNode.nodeID
      : null;

  const focusedNodeID = referenceSystem.isEnabled ? activeTriggerNodeResource?.resourceID ?? null : focusedSharedNodeID;
  const selectedID = activeDiagramIsTopic && focusedNodeID ? `${diagramID}:${focusedNodeID}` : diagramID;

  return (
    <>
      <div className={clsx('vfui', containerStyle({ canvasOnly }))}>
        <DraggablePanel
          width={sidebarWidth ?? 256}
          onResize={setSidebarWidth}
          collapsed={!sidebarVisible}
          onCollapse={(collapsed) => toggleCanvasSidebar(!collapsed)}
        >
          <ResizableSection
            id="diagram-sidebar"
            ref={resizableSectionRef}
            onCollapseChange={setFooterCollapsed}
            topContent={
              <TreeView<DiagramSidebarAnyWorkflowMetadata>
                data={workflowsTree}
                onItemClick={onWorkflowItemClick}
                onItemRename={onWorkflowItemRename}
                learnMoreLink={CMS_WORKFLOW_LEARN_MORE}
                selectedItemID={selectedID}
                emptyStateMessage="No workflows found."
                renderItemContextMenu={renderWorkflowItemContextMenu}
              />
            }
            bottomContent={
              <TreeView<DiagramSidebarAnyFlowMetadata>
                data={flowsTree}
                onItemClick={onFlowItemClick}
                onItemRename={onFlowItemRename}
                learnMoreLink={CMS_FLOW_LEARN_MORE}
                selectedItemID={selectedID}
                emptyStateMessage="No components found."
                renderItemContextMenu={renderFlowItemContextMenu}
              />
            }
            topHeader={
              <ResizableSectionHeader
                label="Workflows"
                onClick={() => workflowCreateModal.openVoid({ folderID: null, jumpTo: true })}
                tooltipText="New workflow"
                readonly={!canEditCanvas}
              />
            }
            bottomHeader={
              <ResizableSectionHeader
                label="Components"
                onClick={() =>
                  footerCollapsed
                    ? resizableSectionRef.current?.expand()
                    : flowCreateModal.openVoid({ folderID: null, jumpTo: true })
                }
                tooltipText="New component"
                isCollapsed={footerCollapsed}
                readonly={!canEditCanvas}
              />
            }
          />

          {sidebarVisible && (
            <>
              {!isCommenting && <StepMenu />}

              <DiagramSidebarToolbar />
            </>
          )}
        </DraggablePanel>

        {!sidebarVisible && (
          <>
            {!isCommenting && <StepMenu />}

            <DiagramSidebarToolbar />
          </>
        )}
      </div>

      <TreeView.DragLayer />
    </>
  );
});
