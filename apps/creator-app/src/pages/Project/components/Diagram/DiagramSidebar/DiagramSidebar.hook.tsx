import { Utils } from '@voiceflow/common';
import { Flow, FolderScope, Workflow } from '@voiceflow/dtos';
import { BlockType } from '@voiceflow/realtime-sdk';
import { IContextMenuChildren, Menu, notify, usePersistFunction } from '@voiceflow/ui-next';
import pluralize from 'pluralize';
import React, { useCallback } from 'react';

import { Designer, Router } from '@/ducks';
import { useGetCMSResourcePath, useOpenCMSResourceDeleteConfirmModal } from '@/hooks/cms-resource.hook';
import { useFolderTree, useGetFolderPath } from '@/hooks/folder.hook';
import { useDispatch, useSelector, useStore } from '@/hooks/store.hook';
import { clipboardCopy } from '@/utils/clipboard.util';
import { getFolderScopeLabel } from '@/utils/cms.util';

import { DiagramSidebarFlowTreeData, DiagramSidebarWorkflowTreeData } from './DiagramSidebar.interface';

export const useFlowsTree = () => {
  const flows = useSelector(Designer.Flow.selectors.all);

  return useFolderTree<Flow, DiagramSidebarFlowTreeData>({
    data: flows,
    folderScope: FolderScope.FLOW,
    buildFolderTree: useCallback(
      (folder, children): DiagramSidebarFlowTreeData => ({
        id: folder.id,
        type: 'folder',
        label: folder.name,
        children,
        metaData: { id: folder.id, type: 'folder' },
      }),
      []
    ),
    buildDataTree: useCallback(
      (flow): DiagramSidebarFlowTreeData => ({
        id: flow.diagramID,
        type: 'component',
        label: flow.name,
        metaData: { id: flow.id, type: 'flow', diagramID: flow.diagramID },
      }),
      []
    ),
  });
};

export const useWorkflowsTree = () => {
  const workflows = useSelector(Designer.Workflow.selectors.all);
  const triggersMapByDiagramID = useSelector(Designer.Workflow.selectors.triggersMapByDiagramID);

  return useFolderTree<Workflow, DiagramSidebarWorkflowTreeData>({
    data: workflows,
    folderScope: FolderScope.WORKFLOW,
    buildFolderTree: useCallback(
      (folder, children): DiagramSidebarWorkflowTreeData => ({
        id: folder.id,
        type: 'folder',
        label: folder.name,
        children,
        metaData: { id: folder.id, type: 'folder' },
      }),
      []
    ),
    buildDataTree: useCallback(
      (workflow): DiagramSidebarWorkflowTreeData => ({
        id: workflow.diagramID,
        type: 'workflow',
        label: workflow.name,
        children:
          triggersMapByDiagramID[workflow.diagramID]?.map(
            (node): DiagramSidebarWorkflowTreeData => ({
              id: `${workflow.diagramID}:${node.nodeID}`,
              type: node.type === BlockType.START ? 'root' : 'child',
              label: node.label,
              metaData: { type: 'node', nodeType: node.type, nodeID: node.nodeID, diagramID: workflow.diagramID },
            })
          ) ?? [],
        metaData: { id: workflow.id, type: 'workflow', diagramID: workflow.diagramID },
      }),
      [triggersMapByDiagramID]
    ),
  });
};

const useRenderFolderContextMenu = ({ folderScope, canEditCanvas }: { folderScope: FolderScope; canEditCanvas: boolean }) => {
  const getFolderPath = useGetFolderPath(folderScope);
  const openCMSResourceDeleteConfirmModal = useOpenCMSResourceDeleteConfirmModal();

  const store = useStore();
  const deleteOne = useDispatch(Designer.Folder.effect.deleteOne);

  return ({ folderID, onClose, onRename }: { folderID: string; onClose: VoidFunction; onRename: (event?: React.MouseEvent) => void }) => {
    const onCopyLink = () => {
      clipboardCopy(`${window.location.origin}${getFolderPath(folderID)}`);

      notify.short.success(`Copied`);
    };

    const onDelete = () => {
      const state = store.getState();
      const nestedFolderIDs = Designer.Folder.selectors.allDeeplyNestedIDsByScopeAndParentID(state, { parentID: folderID, folderScope });
      const allResources = Designer.utils.getCMSResourceAllByFolderIDsSelector(folderScope)(state, {
        folderIDs: [folderID, ...nestedFolderIDs],
      });

      const allResourcesSize = allResources.length;
      const label = pluralize(getFolderScopeLabel(folderScope), allResourcesSize);

      openCMSResourceDeleteConfirmModal({ size: allResourcesSize, label, onConfirm: async () => deleteOne(folderID) });
    };

    return (
      <>
        {canEditCanvas && <Menu.Item label="Rename" onClick={Utils.functional.chain(onRename, onClose)} prefixIconName="Edit" />}

        <Menu.Item label="Copy link" onClick={Utils.functional.chain(onCopyLink, onClose)} prefixIconName="Link" />

        {canEditCanvas && (
          <>
            <Menu.Divider />

            <Menu.Item label="Delete" prefixIconName="Trash" onClick={Utils.functional.chain(onDelete, onClose)} />
          </>
        )}
      </>
    );
  };
};

export const useRenderFlowItemContextMenu = ({ canEditCanvas }: { canEditCanvas: boolean }) => {
  const renderFolderContextMenu = useRenderFolderContextMenu({ folderScope: FolderScope.FLOW, canEditCanvas });
  const openCMSResourceDeleteConfirmModal = useOpenCMSResourceDeleteConfirmModal();

  const deleteOne = useDispatch(Designer.Flow.effect.deleteOne);
  const goToDiagram = useDispatch(Router.goToDiagram);
  const duplicateOne = useDispatch(Designer.Flow.effect.duplicateOne);

  return usePersistFunction(
    ({ item, onClose, onRename }: IContextMenuChildren & { item: DiagramSidebarFlowTreeData; onRename: (event?: React.MouseEvent) => void }) => {
      if (item.metaData.type === 'folder') return renderFolderContextMenu({ folderID: item.metaData.id, onClose, onRename });
      if (item.metaData.type !== 'flow' || !canEditCanvas) return null;

      const { id, diagramID } = item.metaData;

      const onDuplicate = async () => {
        const flow = await duplicateOne(id);

        goToDiagram(flow.diagramID);
      };

      const onDelete = () => {
        const label = getFolderScopeLabel(FolderScope.FLOW);

        openCMSResourceDeleteConfirmModal({ size: 1, label, onConfirm: async () => deleteOne(id) });
      };

      return (
        <>
          <Menu.Item label="Rename" onClick={Utils.functional.chain(onRename, onClose)} prefixIconName="Edit" />

          <Menu.Item label="Edit" onClick={Utils.functional.chain(() => goToDiagram(diagramID), onClose)} prefixIconName="EditS" />

          <Menu.Item label="Duplicate" onClick={Utils.functional.chain(onDuplicate, onClose)} prefixIconName="Duplicate" />

          <Menu.Divider />

          <Menu.Item label="Delete" prefixIconName="Trash" onClick={Utils.functional.chain(onDelete, onClose)} />
        </>
      );
    }
  );
};

export const useRenderWorkflowItemContextMenu = ({ canEditCanvas }: { canEditCanvas: boolean }) => {
  const getCMSResourcePath = useGetCMSResourcePath(FolderScope.WORKFLOW);
  const renderFolderContextMenu = useRenderFolderContextMenu({ folderScope: FolderScope.WORKFLOW, canEditCanvas });

  const deleteOne = useDispatch(Designer.Workflow.effect.deleteOne);
  const goToDiagram = useDispatch(Router.goToDiagram);
  const duplicateOne = useDispatch(Designer.Workflow.effect.duplicateOne);
  const openCMSResourceDeleteConfirmModal = useOpenCMSResourceDeleteConfirmModal();

  return usePersistFunction(
    ({ item, onClose, onRename }: IContextMenuChildren & { item: DiagramSidebarWorkflowTreeData; onRename: (event?: React.MouseEvent) => void }) => {
      if (item.metaData.type === 'folder') return renderFolderContextMenu({ folderID: item.metaData.id, onClose, onRename });
      if (item.metaData.type !== 'workflow') return null;

      const { id } = item.metaData;

      const onCopyLink = () => {
        clipboardCopy(`${window.location.origin}${getCMSResourcePath(id)}`);

        notify.short.success(`Copied`);
      };

      const onDuplicate = async () => {
        const workflow = await duplicateOne(id);

        goToDiagram(workflow.diagramID);
      };

      const onDelete = () => {
        const label = getFolderScopeLabel(FolderScope.WORKFLOW);

        openCMSResourceDeleteConfirmModal({ size: 1, label, onConfirm: () => deleteOne(id) });
      };

      return (
        <>
          {canEditCanvas && <Menu.Item label="Rename" onClick={Utils.functional.chain(onRename, onClose)} prefixIconName="EditS" />}

          {canEditCanvas && <Menu.Item label="Duplicate" onClick={Utils.functional.chain(onDuplicate, onClose)} prefixIconName="Duplicate" />}

          <Menu.Item label="Copy link" onClick={Utils.functional.chain(onCopyLink, onClose)} prefixIconName="Link" />

          {canEditCanvas && (
            <>
              <Menu.Divider />

              <Menu.Item label="Delete" prefixIconName="Trash" onClick={Utils.functional.chain(onDelete, onClose)} />
            </>
          )}
        </>
      );
    }
  );
};
