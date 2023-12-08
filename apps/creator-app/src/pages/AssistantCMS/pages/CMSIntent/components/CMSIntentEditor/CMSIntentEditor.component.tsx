import { Box, DataNotification, Divider, Editor, PopperProvider, Scroll } from '@voiceflow/ui-next';
import React from 'react';

import { CMSEditorDescription } from '@/components/CMS/CMSEditor/CMSEditorDescription/CMSEditorDescription.component';
import { IntentEditForm } from '@/components/Intent/IntentEditForm/IntentEditForm.component';
import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { isBuiltInIntent } from '@/utils/intent';
import { getIntentConfidenceMessage, getIntentConfidenceProgress } from '@/utils/intent.util';

import { CMSEditorMoreButton } from '../../../../components/CMSEditorMoreButton/CMSEditorMoreButton.components';
import { useCMSResourceGetMoreMenu } from '../../../../hooks/cms-resource.hook';
import { useCMSResourceEditor } from '../../../../hooks/cms-resource-editor.hook';
import { useCMSActiveResourceID } from '../../../../hooks/cms-table.hook';

export const CMSIntentEditor: React.FC = () => {
  const editor = useCMSResourceEditor();
  const intentID = useCMSActiveResourceID();
  const getMoreMenu = useCMSResourceGetMoreMenu();

  const intent = useSelector(Designer.Intent.selectors.oneByID, { id: intentID });
  const utterancesCount = useSelector(Designer.Intent.Utterance.selectors.countByIntentID, { intentID });

  const patchIntent = useDispatch(Designer.Intent.effect.patchOne, intentID);

  const onChangeName = (name: string) => {
    if (!name) return;

    patchIntent({ name });
  };

  if (!intent) return null;

  return (
    <PopperProvider portalNode={editor.drawerRef.current ?? undefined}>
      <Editor
        title={intent.name}
        divider={false}
        readOnly={isBuiltInIntent(intent.id)}
        onTitleChange={onChangeName}
        headerActions={<CMSEditorMoreButton>{({ onClose }) => getMoreMenu({ id: intentID, onClose })}</CMSEditorMoreButton>}
      >
        <Scroll style={{ display: 'block' }}>
          <Box gap={8} px={24} pb={4} width="100%">
            <DataNotification
              type="confidence"
              text={getIntentConfidenceMessage(utterancesCount)}
              score={Math.round(getIntentConfidenceProgress(utterancesCount))}
            />
          </Box>

          <IntentEditForm intent={intent} />

          <Divider noPadding />

          <CMSEditorDescription
            value={intent.description ?? ''}
            placeholder="Enter intent description"
            onValueChange={(description) => patchIntent({ description })}
          />
        </Scroll>
      </Editor>
    </PopperProvider>
  );
};
