import { tid } from '@voiceflow/style';
import type { IEditorAPI } from '@voiceflow/ui-next';
import { Box, DataNotification, Divider, Editor, PopperProvider, Scroll } from '@voiceflow/ui-next';
import { useAtomValue } from 'jotai';
import React, { useMemo, useRef } from 'react';

import { CMSEditorDescription } from '@/components/CMS/CMSEditor/CMSEditorDescription/CMSEditorDescription.component';
import { IntentEditForm } from '@/components/Intent/IntentEditForm/IntentEditForm.component';
import { Designer } from '@/ducks';
import { useIntentDescriptionPlaceholder } from '@/hooks/intent.hook';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { EDITOR_TEST_ID } from '@/pages/AssistantCMS/AssistantCMS.constant';
import { transformCMSResourceName } from '@/utils/cms.util';
import {
  getIntentConfidenceLevel,
  getIntentConfidenceMessage,
  getIntentConfidenceProgress,
  isIntentBuiltIn,
} from '@/utils/intent.util';
import { isUtteranceTextEmpty } from '@/utils/utterance.util';

import { CMSEditorMoreButton } from '../../../../components/CMSEditorMoreButton/CMSEditorMoreButton.components';
import { useCMSResourceGetMoreMenu } from '../../../../hooks/cms-resource.hook';
import { useCMSResourceEditor } from '../../../../hooks/cms-resource-editor.hook';
import { useCMSActiveResourceID } from '../../../../hooks/cms-table.hook';

export const CMSIntentEditor: React.FC = () => {
  const editorRef = useRef<IEditorAPI>(null);

  const editor = useCMSResourceEditor();
  const intentID = useCMSActiveResourceID();
  const portalNode = useAtomValue(editor.drawerNode);
  const getMoreMenu = useCMSResourceGetMoreMenu({
    onRename: () => editorRef.current?.startTitleEditing(),
    canRename: (resourceID) => !isIntentBuiltIn(resourceID),
  });
  const descriptionPlaceholder = useIntentDescriptionPlaceholder();

  const intent = useSelector(Designer.Intent.selectors.oneWithFormattedBuiltNameByID, { id: intentID });
  const utterances = useSelector(Designer.Intent.Utterance.selectors.allByIntentID, { intentID });

  const patchIntent = useDispatch(Designer.Intent.effect.patchOne, intentID);

  const notEmptyUtterances = useMemo(
    () => utterances.filter((utterance) => !isUtteranceTextEmpty(utterance.text)),
    [utterances]
  );

  if (!intent) return null;

  return (
    <PopperProvider portalNode={portalNode ?? undefined}>
      <Editor
        ref={editorRef}
        title={intent.name}
        divider={false}
        readOnly={isIntentBuiltIn(intent.id)}
        onTitleChange={(name) => patchIntent({ name: name.trim() })}
        titleTransform={transformCMSResourceName}
        headerActions={
          <CMSEditorMoreButton>{({ onClose }) => getMoreMenu({ id: intentID, onClose })}</CMSEditorMoreButton>
        }
        testID={EDITOR_TEST_ID}
      >
        <Scroll style={{ display: 'block' }}>
          <Box gap={8} px={24} pb={4} width="100%">
            <DataNotification
              type="confidence"
              text={getIntentConfidenceMessage(notEmptyUtterances.length)}
              score={Math.round(getIntentConfidenceProgress(notEmptyUtterances.length))}
              level={getIntentConfidenceLevel(notEmptyUtterances.length)}
              testID={tid('intent', 'confidence')}
            />
          </Box>

          <IntentEditForm intent={intent} />

          <Divider noPadding />

          <CMSEditorDescription
            placeholder={descriptionPlaceholder}
            value={intent.description ?? ''}
            onValueChange={(description) => patchIntent({ description })}
            testID={tid('intent', 'description')}
          />
        </Scroll>
      </Editor>
    </PopperProvider>
  );
};
