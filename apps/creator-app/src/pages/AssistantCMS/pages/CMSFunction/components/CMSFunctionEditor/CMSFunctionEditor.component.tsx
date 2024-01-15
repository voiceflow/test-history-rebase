import { Box, Editor, IEditorAPI, Scroll, SquareButton } from '@voiceflow/ui-next';
import React, { useRef } from 'react';
import { useHistory } from 'react-router';

import { CMSEditorDescription } from '@/components/CMS/CMSEditor/CMSEditorDescription/CMSEditorDescription.component';
import { FunctionEditForm } from '@/components/Function/FunctionEditForm/FunctionEditForm.component';
import { CMSRoute } from '@/config/routes';
import { Designer } from '@/ducks';
import * as Router from '@/ducks/router';
import { useGetAtomValue } from '@/hooks/atom.hook';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { useCMSManager } from '@/pages/AssistantCMS/contexts/CMSManager';
import { useCMSRouteFolders } from '@/pages/AssistantCMS/contexts/CMSRouteFolders';
import { transformCMSResourceName } from '@/utils/cms.util';

import { CMSEditorMoreButton } from '../../../../components/CMSEditorMoreButton/CMSEditorMoreButton.components';
import { useCMSResourceGetMoreMenu } from '../../../../hooks/cms-resource.hook';
import { useCMSActiveResourceID } from '../../../../hooks/cms-table.hook';
import { CMSFunctionImageUpload } from '../CMSFunctionImageUpload/CMSFunctionImageUpload.component';

export const CMSFunctionEditor: React.FC = () => {
  const editorRef = useRef<IEditorAPI>(null);

  const goToCMSResource = useDispatch(Router.goToCMSResource);
  const navigate = useHistory();
  const cmsManager = useCMSManager();
  const functionID = useCMSActiveResourceID();
  const getAtomValue = useGetAtomValue();
  const routeFolders = useCMSRouteFolders();

  const functionResource = useSelector(Designer.Function.selectors.oneByID, { id: functionID });

  const exportMany = useDispatch(Designer.Function.effect.exportMany);
  const patchFunction = useDispatch(Designer.Function.effect.patchOne, functionID);
  const duplicateOne = useDispatch(Designer.Function.effect.duplicateOne);

  const getMoreMenu = useCMSResourceGetMoreMenu({
    onRename: () => editorRef.current?.startTitleEditing(),
    onExport: () => exportMany([functionID]),
    onDuplicate: async (id) => {
      const data = await duplicateOne(id);

      goToCMSResource(CMSRoute.FUNCTION, data.functionResource.id);
    },
  });
  const getFolderPath = () => getAtomValue(routeFolders.activeFolderURL) ?? getAtomValue(cmsManager.url);

  return (
    <Editor
      ref={editorRef}
      title={functionResource?.name ?? ''}
      onTitleChange={(name) => patchFunction({ name: name.trim() })}
      titleTransform={transformCMSResourceName}
      headerActions={
        <Box align="center">
          <CMSEditorMoreButton>{({ onClose }) => getMoreMenu({ id: functionID, onClose })}</CMSEditorMoreButton>
          <Box ml={8}>
            <SquareButton size="medium" onClick={() => navigate.push(getFolderPath())} iconName="CloseM" />
          </Box>
        </Box>
      }
    >
      <Scroll>
        <FunctionEditForm pt={20} functionID={functionID} />

        <CMSEditorDescription
          value={functionResource?.description ?? ''}
          placeholder="Enter a description"
          onValueChange={(value) => patchFunction({ description: value })}
        />

        <CMSFunctionImageUpload onValueChange={(value) => patchFunction({ image: value })} value={functionResource?.image} />
      </Scroll>
    </Editor>
  );
};
