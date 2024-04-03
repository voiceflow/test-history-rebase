import { tid } from '@voiceflow/style';
import { Box, Button, Divider, Editor, IEditorAPI, Scroll } from '@voiceflow/ui-next';
import React, { useRef } from 'react';

import { CMSEditorDescription } from '@/components/CMS/CMSEditor/CMSEditorDescription/CMSEditorDescription.component';
import { CMSRoute } from '@/config/routes';
import { Designer } from '@/ducks';
import * as Router from '@/ducks/router';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { EDITOR_TEST_ID } from '@/pages/AssistantCMS/AssistantCMS.constant';

import { CMSEditorMoreButton } from '../../../../components/CMSEditorMoreButton/CMSEditorMoreButton.components';
import { useCMSResourceGetMoreMenu } from '../../../../hooks/cms-resource.hook';
import { useCMSActiveResourceID } from '../../../../hooks/cms-table.hook';

export const CMSWorkflowEditor: React.FC = () => {
  const editorRef = useRef<IEditorAPI>(null);

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
  });

  const workflow = useSelector(Designer.Workflow.selectors.oneByID, { id: workflowID });
  const patchWorkflow = useDispatch(Designer.Workflow.effect.patchOne, workflowID);

  if (!workflow) return null;

  return (
    <Editor
      ref={editorRef}
      title={workflow.name}
      testID={EDITOR_TEST_ID}
      onTitleChange={(name) => patchWorkflow({ name: name.trim() })}
      headerActions={<CMSEditorMoreButton>{({ onClose }) => getMoreMenu({ id: workflowID, onClose })}</CMSEditorMoreButton>}
    >
      <Scroll style={{ display: 'block' }}>
        <Box px={24} py={20} direction="column">
          <Button onClick={() => workflow.diagramID && goToDiagram(workflow.diagramID)} label="Edit workflow" variant="primary" fullWidth />
        </Box>

        <Divider noPadding />

        <CMSEditorDescription
          value={workflow.description ?? ''}
          testID={tid(EDITOR_TEST_ID, 'description')}
          placeholder="Enter description"
          onValueChange={(description) => patchWorkflow({ description })}
        />
      </Scroll>
    </Editor>
  );
};
