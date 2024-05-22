import { WorkflowStatus } from '@voiceflow/dtos';
import { tid } from '@voiceflow/style';
import {
  Box,
  Button,
  Divider,
  Editor,
  IEditorAPI,
  IndicatorStatus,
  notify,
  Scroll,
  Text,
  WorkflowManager,
} from '@voiceflow/ui-next';
import { IAssignee } from '@voiceflow/ui-next/build/next/components/Other/WorkflowManager/types';
import React, { useMemo, useRef } from 'react';
import { match } from 'ts-pattern';

import { CMSEditorDescription } from '@/components/CMS/CMSEditor/CMSEditorDescription/CMSEditorDescription.component';
import { CMSRoute } from '@/config/routes';
import { Designer, Router, Workspace } from '@/ducks';
import { useDispatch, useGetValueSelector, useSelector } from '@/hooks/store.hook';
import { EDITOR_TEST_ID } from '@/pages/AssistantCMS/AssistantCMS.constant';
import { getMemberColorByCreatorID, isMemberColorImage } from '@/utils/member.util';

import { CMSEditorMoreButton } from '../../../../components/CMSEditorMoreButton/CMSEditorMoreButton.components';
import { useCMSResourceGetMoreMenu } from '../../../../hooks/cms-resource.hook';
import { useCMSActiveResourceID } from '../../../../hooks/cms-table.hook';
import { workflowManagerContainer } from './CMSWorkflowEditor.css';

export const CMSWorkflowEditor: React.FC = () => {
  const editorRef = useRef<IEditorAPI>(null);

  const members = useSelector(Workspace.active.normalizedMembersSelector);
  const getOneByID = useGetValueSelector(Designer.Workflow.selectors.oneByID);
  const workflowID = useCMSActiveResourceID();

  const goToDiagram = useDispatch(Router.goToDiagram);
  const duplicateOne = useDispatch(Designer.Workflow.effect.duplicateOne);
  const goToCMSResource = useDispatch(Router.goToCMSResource);

  const getMoreMenu = useCMSResourceGetMoreMenu({
    onRename: () => editorRef.current?.startTitleEditing(),
    onDuplicate: async (id) => {
      const data = await duplicateOne(id);

      goToCMSResource(CMSRoute.WORKFLOW, data.id);
    },

    canDelete: (resourceID) => {
      const workflow = getOneByID({ id: resourceID });

      if (!workflow?.isStart) return true;

      return {
        allowed: false,
        tooltip: {
          placement: 'left',
          children: () => <Text variant="caption">Default workflow can’t be deleted</Text>,
        },
      };
    },
  });

  const workflow = useSelector(Designer.Workflow.selectors.oneByID, { id: workflowID });
  const patchWorkflow = useDispatch(Designer.Workflow.effect.patchOne, workflowID);

  const assignees = useMemo(
    () =>
      members.map((member) => ({
        id: member.creator_id,
        name: member.name,
        avatar: isMemberColorImage(member.image) ? undefined : member.image,
        variant: getMemberColorByCreatorID(member.creator_id, 'light'),
      })),
    [members]
  );

  const assignee = useMemo(() => {
    if (!workflow?.assigneeID) return { id: -1, name: 'Unassigned', variant: 'base' };

    const member = assignees.find(({ id }) => id === workflow.assigneeID);

    return member ?? { id: -1, name: 'Unknown', variant: 'base' };
  }, [workflow?.assigneeID, assignees]);

  const status = useMemo(
    () =>
      match(workflow?.status ?? null)
        .with(null, () => IndicatorStatus.NONE)
        .with(WorkflowStatus.TO_DO, () => IndicatorStatus.TODO)
        .with(WorkflowStatus.COMPLETE, () => IndicatorStatus.DONE)
        .with(WorkflowStatus.IN_PROGRESS, () => IndicatorStatus.IN_PROGRESS)
        .exhaustive(),
    [workflow?.status]
  );

  const onStatusChange = async (status: IndicatorStatus) => {
    await patchWorkflow({
      status: match(status)
        .with(IndicatorStatus.TODO, () => WorkflowStatus.TO_DO)
        .with(IndicatorStatus.DONE, () => WorkflowStatus.COMPLETE)
        .with(IndicatorStatus.NONE, () => null)
        .with(IndicatorStatus.IN_PROGRESS, () => WorkflowStatus.IN_PROGRESS)
        .exhaustive(),
    });

    notify.short.success('Updated');
  };

  const onAssigneeChange = async (assignee: IAssignee | null) => {
    await patchWorkflow({ assigneeID: assignee?.id || null });

    notify.short.success('Updated');
  };

  if (!workflow) return null;

  return (
    <Editor
      ref={editorRef}
      title={workflow.name}
      testID={EDITOR_TEST_ID}
      onTitleChange={(name) => patchWorkflow({ name: name.trim() })}
      headerActions={
        <CMSEditorMoreButton>{({ onClose }) => getMoreMenu({ id: workflowID, onClose })}</CMSEditorMoreButton>
      }
    >
      <Scroll style={{ display: 'block' }}>
        <Box px={24} py={20} direction="column">
          <Button onClick={() => goToDiagram(workflow.diagramID)} label="Edit workflow" variant="primary" fullWidth />
        </Box>

        <Divider noPadding />

        <CMSEditorDescription
          value={workflow.description ?? ''}
          testID={tid(EDITOR_TEST_ID, 'description')}
          placeholder="Enter description"
          onValueChange={(description) => patchWorkflow({ description })}
        />
      </Scroll>

      <div className={workflowManagerContainer}>
        <WorkflowManager
          status={status}
          assignee={assignee}
          assignees={assignees}
          onStatusChange={onStatusChange}
          onAssigneeChange={onAssigneeChange}
          onAssigneeRemove={() => onAssigneeChange(null)}
        />
      </div>
    </Editor>
  );
};
