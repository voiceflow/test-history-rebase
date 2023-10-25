import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { Alert, SectionV2 } from '@voiceflow/ui';
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

import EntityPromptSection from '@/components/EntityPromptSection';
import * as IntentV2 from '@/ducks/intentV2';
import { useDispatch, useFeature, useSelector } from '@/hooks';
import { useAllEntitiesByIDsSelector, useOneEntityWithVariantsByIDSelector } from '@/hooks/entity.hook';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { isAlexaPlatform } from '@/utils/typeGuards';

interface EditorProps {
  goBack?: VoidFunction;
}

const Editor: React.FC<EditorProps> = ({ goBack }) => {
  const editor = EditorV2.useEditor();
  const cmsV2 = useFeature(FeatureFlag.V2_CMS);

  const location = useLocation<{ autogenerate?: boolean }>();
  const { intentID, entityID: requiredEntityID } = useParams<{ intentID: string; entityID: string }>();

  const intent = useSelector(IntentV2.intentByIDSelector, { id: intentID });
  const intentEntity = useSelector(IntentV2.intentSlotByIntentIDSlotIDSelector, { id: intentID, slotID: requiredEntityID });
  const intentEntityIDs = useSelector(IntentV2.slotsByIntentIDSelector, { id: intentID });
  const entity = useOneEntityWithVariantsByIDSelector({ id: requiredEntityID });
  const entities = useAllEntitiesByIDsSelector({ ids: intentEntityIDs });

  const onChangeDialog = useDispatch(IntentV2.updateIntentSlotDialog, intentID, requiredEntityID);

  const isAlexa = isAlexaPlatform(editor.platform);

  if (cmsV2.isEnabled) {
    // TODO: [CMS V2] - implement
    return (
      <EditorV2 header={<EditorV2.DefaultHeader onBack={goBack ?? editor.goBack} />}>
        <Alert variant={Alert.Variant.WARNING}>This component is not yet implemented in the new CMS</Alert>
      </EditorV2>
    );
  }

  return (
    <EditorV2 header={<EditorV2.DefaultHeader onBack={goBack ?? editor.goBack} />}>
      {!!entity && !!intentEntity && (
        <>
          <EntityPromptSection
            entity={entity}
            prompts={intentEntity.dialog.prompt}
            entities={entities}
            onChange={(prompt) => onChangeDialog({ prompt })}
            intentName={intent?.name ?? ''}
            intentInputs={intent?.inputs ?? []}
            autogenerate={location.state?.autogenerate}
          />

          <SectionV2.Divider />

          {isAlexa && (
            <>
              <EntityPromptSection
                title="Confirmation"
                entity={entity}
                prompts={intentEntity.dialog.confirm}
                entities={entities}
                onChange={(confirm) => onChangeDialog({ confirm, confirmEnabled: !!confirm.length })}
                placeholder="Yes or no question to confirm the entity value"
                intentName={intent?.name ?? ''}
                intentInputs={intent?.inputs ?? []}
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
