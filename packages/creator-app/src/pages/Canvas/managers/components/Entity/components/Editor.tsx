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
import { PlatformContext, ProjectTypeContext } from '@/pages/Project/contexts';
import { getPlatformIntentPromptFactory } from '@/utils/prompt';
import { isAlexaPlatform } from '@/utils/typeGuards';

import PromptConfirmSection from './PromptConfirmSection';

const Editor: React.FC = () => {
  const platform = React.useContext(PlatformContext)!;
  const projectType = React.useContext(ProjectTypeContext)!;

  const editor = EditorV2.useEditor();

  // onBlur event can be fired after the user clicks on the remove button
  // in this case prompt will not be removed, using ref to prevent that
  const promptRemovingRef = React.useRef(false);
  const confirmRemovingRef = React.useRef(false);

  const { intentID, entityID } = useParams<{ intentID: string; entityID: string }>();

  const defaultVoice = useSelector(VersionV2.active.defaultVoiceSelector);
  const intentEntity = useSelector(IntentV2.intentSlotByIntentIDSlotIDSelector, { id: intentID, slotID: entityID });
  const intentEntityIDs = useSelector(IntentV2.slotsByIntentIDSelector, { id: intentID });
  const intentEntities = useSelector(SlotV2.slotsByIDsSelector, { ids: intentEntityIDs });

  const updateIntentSlotDialog = useDispatch(Intent.updateIntentSlotDialog, intentID, entityID);

  const intentPromptFactory = getPlatformIntentPromptFactory(projectType);

  const onAddPrompt = () => {
    promptRemovingRef.current = false;

    updateIntentSlotDialog({ prompt: [intentPromptFactory({ defaultVoice })] } as Partial<Realtime.IntentSlotDialog>);
  };

  const onRemovePrompt = () => {
    promptRemovingRef.current = true;

    updateIntentSlotDialog({ prompt: [] });
  };

  const onAddConfirm = () => {
    confirmRemovingRef.current = false;

    updateIntentSlotDialog({ confirm: [intentPromptFactory({ defaultVoice })], confirmEnabled: true } as Partial<Realtime.IntentSlotDialog>);
  };

  const onRemoveConfirm = () => {
    confirmRemovingRef.current = true;

    updateIntentSlotDialog({ confirm: [], confirmEnabled: false });
  };

  const isAlexa = isAlexaPlatform(platform);
  const hasDialogPrompt = !!intentEntity?.dialog.prompt.length;
  const hasDialogConfirm = !!intentEntity?.dialog.confirm.length;
  const withDialogConfirm = !!intentEntity?.dialog.confirmEnabled && hasDialogConfirm;

  return (
    <EditorV2 header={<EditorV2.DefaultHeader onBack={editor.goBack} />}>
      {!!intentEntity && (
        <>
          <PromptConfirmSection
            title="Entity prompt"
            onAdd={onAddPrompt}
            prompt={intentEntity.dialog.prompt}
            onChange={(prompt) => !promptRemovingRef.current && updateIntentSlotDialog({ prompt } as Partial<Realtime.IntentSlotDialog>)}
            onRemove={onRemovePrompt}
            collapsed={!hasDialogPrompt}
            placeholder="Enter question to prompt user to fill entity"
            intentEntities={intentEntities}
          />

          <SectionV2.Divider />

          {isAlexa && (
            <>
              <PromptConfirmSection
                title="Confirmation"
                onAdd={onAddConfirm}
                prompt={intentEntity.dialog.confirm}
                onChange={(confirm) =>
                  !confirmRemovingRef.current && updateIntentSlotDialog({ confirm, confirmEnabled: true } as Partial<Realtime.IntentSlotDialog>)
                }
                onRemove={onRemoveConfirm}
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
