import { Editor, IEditorAPI, Scroll } from '@voiceflow/ui-next';
import React, { useRef } from 'react';

import { ResponseEditForm } from '@/components/Response/ResponseEditForm/ResponseEditForm.component';
import { CMSRoute } from '@/config/routes';
import { Designer } from '@/ducks';
import { goToCMSResource } from '@/ducks/router';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { EDITOR_TEST_ID } from '@/pages/AssistantCMS/AssistantCMS.constant';

import { CMSEditorMoreButton } from '../../../../components/CMSEditorMoreButton/CMSEditorMoreButton.components';
import { useCMSResourceGetMoreMenu } from '../../../../hooks/cms-resource.hook';
import { useCMSActiveResourceID } from '../../../../hooks/cms-table.hook';

export const CMSResponseEditor: React.FC = () => {
  const editorRef = useRef<IEditorAPI>(null);
  const responseID = useCMSActiveResourceID();
  const response = useSelector(Designer.Response.selectors.oneByID, { id: responseID });
  const duplicateOne = useDispatch(Designer.Response.effect.duplicateOne);

  const getMoreMenu = useCMSResourceGetMoreMenu({
    onDuplicate: async (id) => {
      const data = await duplicateOne(id);

      goToCMSResource(CMSRoute.RESPONSE, data.responseResource.id);
    },
  });

  if (!response) return null;

  return (
    <Editor
      ref={editorRef}
      title="Agent says"
      headerActions={<CMSEditorMoreButton>{({ onClose }) => getMoreMenu({ id: responseID, onClose })}</CMSEditorMoreButton>}
      testID={EDITOR_TEST_ID}
    >
      <Scroll style={{ display: 'block' }}>
        <ResponseEditForm responseID={response.id} />
      </Scroll>
    </Editor>
  );
};
