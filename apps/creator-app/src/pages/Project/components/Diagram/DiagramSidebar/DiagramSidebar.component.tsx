import { DraggablePanel, ResizableSection, Section, TreeView } from '@voiceflow/ui-next';
import { IResizableSectionAPI } from '@voiceflow/ui-next/build/cjs/components/Section/ResizableSection/types';
import React, { useRef } from 'react';

import { Permission } from '@/constants/permissions';
import { Creator, Designer, Router, UI } from '@/ducks';
import { useEventualEngine } from '@/hooks/engine';
import { useFlowCreateModal, useWorkflowCreateModal } from '@/hooks/modal.hook';
import { usePermission } from '@/hooks/permission';
import { useLocalStorageState } from '@/hooks/storage.hook';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { useCommentingMode } from '@/pages/Project/hooks';

import StepMenu from '../../StepMenu';
import { bottomHeaderSectionStyle, containerStyle, topHeaderSectionStyle } from './DiagramSidebar.css';
import { useFlowsTree, useRenderFlowItemContextMenu, useRenderWorkflowItemContextMenu, useWorkflowsTree } from './DiagramSidebar.hook';
import {
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
  const activeDiagramID = useSelector(Creator.activeDiagramIDSelector);

  const goToDiagram = useDispatch(Router.goToDiagram);
  const patchOneFlow = useDispatch(Designer.Flow.effect.patchOne);
  const patchOneFolder = useDispatch(Designer.Folder.effect.patchOne);
  const patchOneWorkflow = useDispatch(Designer.Workflow.effect.patchOne);

  const flowsTree = useFlowsTree();
  const workflowsTree = useWorkflowsTree();
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
      <DraggablePanel>
        <ResizableSection
          id="diagram-sidebar"
          ref={resizableSectionRef}
          onCollapseChange={setFooterCollapsed}
          topContent={
            <TreeView<DiagramSidebarAnyWorkflowMetadata>
              data={workflowsTree}
              onItemClick={onWorkflowItemClick}
              onItemRename={onWorkflowItemRename}
              selectedItemID={selectedID}
              renderItemContextMenu={renderWorkflowItemContextMenu}
            />
          }
          bottomContent={
            <TreeView<DiagramSidebarAnyFlowMetadata>
              data={flowsTree}
              onItemClick={onFlowItemClick}
              onItemRename={onFlowItemRename}
              selectedItemID={selectedID}
              renderItemContextMenu={renderFlowItemContextMenu}
            />
          }
          topHeader={
            <Section.Header.Container py={11} theme="dark" title="Workflows" className={topHeaderSectionStyle}>
              <Section.Header.Button
                variant="dark"
                onClick={() => workflowCreateModal.openVoid({ folderID: null })}
                disabled={!canEditCanvas}
                iconName="Plus"
              />
            </Section.Header.Container>
          }
          bottomHeader={
            <Section.Header.Container
              py={11}
              theme="dark"
              title="Components"
              className={bottomHeaderSectionStyle}
              onHeaderClick={footerCollapsed ? () => resizableSectionRef.current?.expand() : undefined}
            >
              <Section.Header.Button
                variant="dark"
                onClick={footerCollapsed ? undefined : () => flowCreateModal.openVoid({ folderID: null })}
                iconName={footerCollapsed ? 'ArrowUpS' : 'Plus'}
                disabled={!footerCollapsed && !canEditCanvas}
              />
            </Section.Header.Container>
          }
        />

        {!isCommenting && <StepMenu />}
        <DiagramSidebarToolbar />
      </DraggablePanel>

      <TreeView.DragLayer />
    </div>
  );
};
