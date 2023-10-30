import { Box, CircleButton, Editor } from '@voiceflow/ui-next';
import React from 'react';

import { CMSEditorDescription } from '@/components/CMS/CMSEditor/CMSEditorDescription/CMSEditorDescription.component';
import { FunctionEditForm } from '@/components/Function/FunctionEditForm/FunctionEditForm.component';
import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { Modals, useModal } from '@/ModalsV2';

import { CMSEditorMoreButton } from '../../../../components/CMSEditorMoreButton/CMSEditorMoreButton.components';
import { useCMSActiveResourceID } from '../../../../hooks/cms-table.hook';
import { testButton } from './CMSFunctionEditor.css';

export const CMSFunctionEditor: React.FC = () => {
  const testModal = useModal(Modals.Function.Test);
  const functionID = useCMSActiveResourceID();

  const functionResource = useSelector(Designer.Function.selectors.oneByID, { id: functionID });

  const patchFunction = useDispatch(Designer.Function.effect.patchOne, functionID);
  const deleteFunction = useDispatch(Designer.Function.effect.deleteOne, functionID);

  return (
    <Editor
      title={functionResource?.name || ''}
      headerActions={<CMSEditorMoreButton options={[{ label: 'Remove', onClick: deleteFunction }]} />}
      onTitleChange={(value) => patchFunction({ name: value })}
    >
      <FunctionEditForm pt={20} functionID={functionID} />

      <CMSEditorDescription
        value={functionResource?.description || ''}
        placeholder="Enter a description"
        onValueChange={(value) => patchFunction({ description: value })}
      />

      <Box className={testButton}>
        <CircleButton iconName="PlayS" onClick={() => testModal.open({ functionID })} />
      </Box>
    </Editor>
  );
};
