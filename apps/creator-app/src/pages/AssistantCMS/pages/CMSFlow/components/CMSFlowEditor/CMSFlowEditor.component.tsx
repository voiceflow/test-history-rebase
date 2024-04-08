import { tid } from '@voiceflow/style';
import { Box, Button, Divider, Editor, IEditorAPI, Scroll } from '@voiceflow/ui-next';
import React, { useRef } from 'react';

import { CMSEditorDescription } from '@/components/CMS/CMSEditor/CMSEditorDescription/CMSEditorDescription.component';
import { CMSRoute } from '@/config/routes';
import { Designer, Router } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { EDITOR_TEST_ID } from '@/pages/AssistantCMS/AssistantCMS.constant';

import { CMSEditorMoreButton } from '../../../../components/CMSEditorMoreButton/CMSEditorMoreButton.components';
import { useCMSResourceGetMoreMenu } from '../../../../hooks/cms-resource.hook';
import { useCMSActiveResourceID } from '../../../../hooks/cms-table.hook';

export const CMSFlowEditor: React.FC = () => {
  const editorRef = useRef<IEditorAPI>(null);

  const flowID = useCMSActiveResourceID();
  const getMoreMenu = useCMSResourceGetMoreMenu({
    onRename: () => editorRef.current?.startTitleEditing(),
    onDuplicate: async (id) => {
      const data = await duplicateOne(id);

      goToCMSResource(CMSRoute.FLOW, data.id);
    },
  });

  const flow = useSelector(Designer.Flow.selectors.oneByID, { id: flowID });

  const patchFlow = useDispatch(Designer.Flow.effect.patchOne, flowID);
  const goToDiagram = useDispatch(Router.goToDiagram);
  const duplicateOne = useDispatch(Designer.Flow.effect.duplicateOne);
  const goToCMSResource = useDispatch(Router.goToCMSResource);

  if (!flow) return null;

  return (
    <Editor
      ref={editorRef}
      title={flow.name}
      onTitleChange={(name) => patchFlow({ name: name.trim() })}
      headerActions={<CMSEditorMoreButton>{({ onClose }) => getMoreMenu({ id: flowID, onClose })}</CMSEditorMoreButton>}
      testID={EDITOR_TEST_ID}
    >
      <Scroll style={{ display: 'block' }}>
        <Box px={24} py={20} direction="column">
          <Button onClick={() => goToDiagram(flow.diagramID)} label="Edit component" variant="primary" fullWidth />
        </Box>

        <Divider noPadding />

        <CMSEditorDescription
          value={flow.description ?? ''}
          testID={tid('flow', 'description')}
          placeholder="Enter description"
          onValueChange={(description) => patchFlow({ description })}
        />
      </Scroll>
    </Editor>
  );
};
