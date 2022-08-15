import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';
import { useParams } from 'react-router-dom';

import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import * as SlotV2 from '@/ducks/slotV2';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { getPlatformIntentPromptFactory } from '@/utils/prompt';
import { isAlexaPlatform } from '@/utils/typeGuards';

import EntityPromptSection from '../../EntityPromptSection';

interface EditorProps {
  goBack?: VoidFunction;
}

const Editor: React.FC<EditorProps> = ({ goBack }) => {
  const editor = EditorV2.useEditor();

  const { intentID, entityID } = useParams<{ intentID: string; entityID: string }>();

  const defaultVoice = useSelector(VersionV2.active.defaultVoiceSelector);
  const intentEntity = useSelector(IntentV2.intentSlotByIntentIDSlotIDSelector, { id: intentID, slotID: entityID });
  const intentEntityIDs = useSelector(IntentV2.slotsByIntentIDSelector, { id: intentID });
  const intentEntities = useSelector(SlotV2.slotsByIDsSelector, { ids: intentEntityIDs });

  const onChangeDialog = useDispatch(Intent.updateIntentSlotDialog, intentID, entityID);

  const intentPromptFactory = getPlatformIntentPromptFactory(editor.projectType);

  const isAlexa = isAlexaPlatform(editor.platform);
  const hasDialogConfirm = !!intentEntity?.dialog.confirm.length;
  const withDialogConfirm = !!intentEntity?.dialog.confirmEnabled && hasDialogConfirm;

  return (
    <EditorV2 header={<EditorV2.DefaultHeader onBack={goBack ?? editor.goBack} />}>
      {!!intentEntity && (
        <>
          <EntityPromptSection
            title="Entity reprompt"
            onAdd={() => onChangeDialog({ prompt: [intentPromptFactory({ defaultVoice })] } as Partial<Realtime.IntentSlotDialog>)}
            prompt={intentEntity.dialog.prompt}
            onChange={(prompt) => onChangeDialog({ prompt } as Partial<Realtime.IntentSlotDialog>)}
            onRemove={() => onChangeDialog({ prompt: [] })}
            collapsed={!intentEntity?.dialog.prompt.length}
            placeholder="Enter question to prompt user to fill entity"
            intentEntities={intentEntities}
          />

          <SectionV2.Divider />

          {isAlexa && (
            <>
              <EntityPromptSection
                title="Confirmation"
                onAdd={() =>
                  onChangeDialog({ confirm: [intentPromptFactory({ defaultVoice })], confirmEnabled: true } as Partial<Realtime.IntentSlotDialog>)
                }
                prompt={intentEntity.dialog.confirm}
                onChange={(confirm) => onChangeDialog({ confirm, confirmEnabled: true } as Partial<Realtime.IntentSlotDialog>)}
                onRemove={() => onChangeDialog({ confirm: [], confirmEnabled: false })}
                collapsed={!withDialogConfirm}
                placeholder="Yes or no question to confirm the entity value"
                intentEntities={intentEntities}
              />

              <SectionV2.Divider />
            </>
          )}
        </>
      )}
    </EditorV2>
  );
};

export default Editor;
