import { Box, DataNotification, Divider, Editor } from '@voiceflow/ui-next';
import React from 'react';

import { CMSEditorDescription } from '@/components/CMS/CMSEditor/CMSEditorDescription/CMSEditorDescription.component';
import { IntentEditForm } from '@/components/Intent/IntentEditForm/IntentEditForm.component';
import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { getIntentConfidenceMessage, getIntentConfidenceProgress } from '@/utils/intent.util';

import { CMSEditorMoreButton } from '../../../../components/CMSEditorMoreButton/CMSEditorMoreButton.components';
import { useCMSActiveResourceID } from '../../../../hooks/cms-table.hook';

export const CMSIntentEditor: React.FC = () => {
  const intentID = useCMSActiveResourceID();

  const intent = useSelector(Designer.Intent.selectors.oneByID, { id: intentID });
  const utterancesCount = useSelector(Designer.Intent.Utterance.selectors.countByIntentID, { intentID });
  const patchIntent = useDispatch(Designer.Intent.effect.patchOne, intentID);
  const deleteIntent = useDispatch(Designer.Intent.effect.deleteOne, intentID);

  if (!intent) return null;

  return (
    <Editor
      title={intent.name}
      onTitleChange={(name) => name && patchIntent({ name })}
      headerActions={<CMSEditorMoreButton options={[{ label: 'Remove', onClick: deleteIntent }]} />}
      divider={false}
    >
      <Box gap={8} px={24} pb={4} width="100%">
        <DataNotification
          score={Math.round(getIntentConfidenceProgress(utterancesCount))}
          type="confidence"
          text={getIntentConfidenceMessage(utterancesCount)}
        />
      </Box>

      <IntentEditForm intentID={intentID} />

      <Divider />

      <CMSEditorDescription
        value={intent.description ?? ''}
        placeholder="Enter intent description"
        onValueChange={(description) => patchIntent({ description })}
      />
    </Editor>
  );
};
