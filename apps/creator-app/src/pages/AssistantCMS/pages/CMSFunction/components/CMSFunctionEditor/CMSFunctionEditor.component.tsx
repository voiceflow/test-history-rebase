import { Box, CircleButton, Editor, Section } from '@voiceflow/ui-next';
import React from 'react';
import { useHistory } from 'react-router';

import { CMSEditorDescription } from '@/components/CMS/CMSEditor/CMSEditorDescription/CMSEditorDescription.component';
import { FunctionEditForm } from '@/components/Function/FunctionEditForm/FunctionEditForm.component';
import { Designer } from '@/ducks';
import { useGetAtomValue } from '@/hooks/atom.hook';
import { useModal } from '@/hooks/modal.hook';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { Modals } from '@/ModalsV2';
import { useCMSManager } from '@/pages/AssistantCMS/contexts/CMSManager';
import { useCMSRouteFolders } from '@/pages/AssistantCMS/contexts/CMSRouteFolders';

import { CMSEditorMoreButton } from '../../../../components/CMSEditorMoreButton/CMSEditorMoreButton.components';
import { useCMSResourceGetMoreMenu } from '../../../../hooks/cms-resource.hook';
import { useCMSActiveResourceID } from '../../../../hooks/cms-table.hook';
import { CMSFunctionImageUpload } from '../CMSFunctionImageUpload/CMSFunctionImageUpload.component';
import { testButton } from './CMSFunctionEditor.css';

export const CMSFunctionEditor: React.FC = () => {
  const navigate = useHistory();
  const testModal = useModal(Modals.Function.Test);
  const cmsManager = useCMSManager();
  const functionID = useCMSActiveResourceID();
  const getMoreMenu = useCMSResourceGetMoreMenu();
  const routeFolders = useCMSRouteFolders();
  const getAtomValue = useGetAtomValue();

  const functionResource = useSelector(Designer.Function.selectors.oneByID, { id: functionID });

  const patchFunction = useDispatch(Designer.Function.effect.patchOne, functionID);

  const getFolderPath = () => getAtomValue(routeFolders.activeFolderURL) ?? getAtomValue(cmsManager.url);

  return (
    <Editor
      title={functionResource?.name ?? ''}
      headerActions={
        <Box align="center">
          <CMSEditorMoreButton>{({ onClose }) => getMoreMenu({ id: functionID, onClose })}</CMSEditorMoreButton>

          <Box ml={8}>
            <Section.Header.Button iconName="CloseM" onClick={() => navigate.push(getFolderPath())} variant="light" size="medium" />
          </Box>
        </Box>
      }
      onTitleChange={(value) => patchFunction({ name: value })}
    >
      <FunctionEditForm pt={20} functionID={functionID} />

      <CMSEditorDescription
        value={functionResource?.description ?? ''}
        placeholder="Enter a description"
        onValueChange={(value) => patchFunction({ description: value })}
      />

      <CMSFunctionImageUpload onValueChange={(value) => patchFunction({ image: value })} value={functionResource?.image} />

      <Box className={testButton}>
        <CircleButton iconName="PlayS" onClick={() => testModal.open({ functionID })} />
      </Box>
    </Editor>
  );
};
