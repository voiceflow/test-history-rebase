import { DraggablePanel, ResizableSection, ResizableSectionHeader, TreeView } from '@voiceflow/ui-next';
import type { IResizableSectionAPI } from '@voiceflow/ui-next/build/cjs/components/Section/ResizableSection/types';
import React, { useRef } from 'react';

import { CMS_FLOW_LEARN_MORE, CMS_WORKFLOW_LEARN_MORE } from '@/constants/link.constant';
import { Permission } from '@/constants/permissions';
import { Creator, Designer, Router, UI } from '@/ducks';
import { useEventualEngine } from '@/hooks/engine';
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
import type {
  DiagramSidebarAnyFlowMetadata,
  DiagramSidebarAnyWorkflowMetadata,
  DiagramSidebarFlowTreeData,
  DiagramSidebarWorkflowTreeData,
} from './DiagramSidebar.interface';
import { DiagramSidebarToolbar } from './DiagramSidebarToolbar.component';

export const DiagramSidebar: React.FC = () => {
  const getEngine = useEventualEngine();
  const isCommenting = useCommentingMode();
  const flowCreateModal = useFlowCreateModal();
  const [canEditCanvas] = usePermission(Permission.CANVAS_EDIT);
  const workflowCreateModal = useWorkflowCreateModal();

  const resizableSectionRef = useRef<IResizableSectionAPI>(null);

  const canvasOnly = useSelector(UI.selectors.isCanvasOnly);
  const creatorFocus = useSelector(Creator.creatorFocusSelector);
  const sidebarWidth = useSelector(UI.selectors.canvasSidebarWidth);
  const sidebarVisible = useSelector(UI.selectors.canvasSidebarVisible);
  const activeDiagramID = useSelector(Creator.activeDiagramIDSelector);

  const goToDiagram = useDispatch(Router.goToDiagram);
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

  const onWorkflowItemClick = (item: DiagramSidebarWorkflowTreeData) => {
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
  };

  const onFlowItemClick = (item: DiagramSidebarFlowTreeData) => {
    const engine = getEngine();

    if (item.metaData.type === 'flow') {
      if (activeDiagramID === item.metaData.diagramID) {
        engine?.focusHome();
      } else {
        goToDiagram(item.metaData.diagramID);
      }
    }
  };

  const onWorkflowItemRename = (item: DiagramSidebarWorkflowTreeData, newName: string) => {
    if (item.metaData.type === 'workflow') {
      patchOneWorkflow(item.metaData.id, { name: newName });
    } else if (item.metaData.type === 'folder') {
      patchOneFolder(item.metaData.id, { name: newName });
    }
  };

  const onFlowItemRename = (item: DiagramSidebarFlowTreeData, newName: string) => {
    if (item.metaData.type === 'flow') {
      patchOneFlow(item.metaData.id, { name: newName });
    } else if (item.metaData.type === 'folder') {
      patchOneFolder(item.metaData.id, { name: newName });
    }
  };

  const focusedNodeID = creatorFocus.isActive ? creatorFocus.target : null;
  const selectedID = focusedNodeID ? `${activeDiagramID}:${focusedNodeID}` : activeDiagramID;

  return (
    <div className={containerStyle({ canvasOnly })}>
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
              onClick={() => workflowCreateModal.openVoid({ folderID: null })}
              tooltipText="New workflow"
            />
          }
          bottomHeader={
            <ResizableSectionHeader
              label="Components"
              onClick={() =>
                footerCollapsed ? resizableSectionRef.current?.expand() : flowCreateModal.openVoid({ folderID: null })
              }
              tooltipText="New component"
            />
          }
        />

        {!isCommenting && <StepMenu />}
        <DiagramSidebarToolbar />
      </DraggablePanel>

      <TreeView.DragLayer />
    </div>
  );
};
