import { Box, DataNotification, Divider, Editor, IEditorAPI, PopperProvider, Scroll } from '@voiceflow/ui-next';
import { useAtomValue } from 'jotai';
import React, { useRef } from 'react';

import { IntentDescription } from '@/components/Intent/IntentDescription/IntentDescription.component';
import { IntentEditForm } from '@/components/Intent/IntentEditForm/IntentEditForm.component';
import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { transformCMSResourceName } from '@/utils/cms.util';
import { getIntentConfidenceMessage, getIntentConfidenceProgress, isIntentBuiltIn } from '@/utils/intent.util';

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

  const intent = useSelector(Designer.Intent.selectors.oneWithFormattedBuiltNameByID, { id: intentID });
  const utterancesCount = useSelector(Designer.Intent.Utterance.selectors.countByIntentID, { intentID });

  const patchIntent = useDispatch(Designer.Intent.effect.patchOne, intentID);

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

          <IntentDescription value={intent.description ?? ''} onValueChange={(description) => patchIntent({ description })} />
        </Scroll>
      </Editor>
    </PopperProvider>
  );
};
