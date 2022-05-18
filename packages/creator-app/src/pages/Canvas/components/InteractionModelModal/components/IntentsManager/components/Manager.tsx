import { Utils } from '@voiceflow/common';
import { ClickableText, ErrorMessage, FlexApart, Input } from '@voiceflow/ui';
import React from 'react';

import IntentForm from '@/components/IntentForm';
import { StandaloneIntentSlotForm } from '@/components/IntentSlotForm';
import RemoveDropdown from '@/components/RemoveDropdown';
import Section from '@/components/Section';
import * as Intents from '@/ducks/intent';
import { applySingleIntentNameFormatting } from '@/ducks/intent/utils';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as SlotV2 from '@/ducks/slotV2';
import { IntentEditType } from '@/ducks/tracking/constants';
import { compose, connect } from '@/hocs';
import { useTrackingEvents } from '@/hooks';
import { FadeLeftContainer } from '@/styles/animations';
import { ConnectedProps, MergeArguments } from '@/types';
import { applyPlatformIntentAndSlotNameFormatting, isCustomizableBuiltInIntent, validateIntentName } from '@/utils/intent';

export interface ManagerProps {
  id: string;
  removeIntent: (id: string) => void;
}

const Manager: React.ForwardRefRenderFunction<{ resetPath: () => void }, ManagerProps & ConnectedManagerProps> = (
  { id: intentID, intent: selectedIntent, platform, slots, removeIntent, patchIntent, allIntents },
  ref
) => {
  const [name, setName] = React.useState(selectedIntent?.name ?? '');
  const [path, setPath] = React.useState<{ type: string | null }>({ type: null });
  const resetPath = React.useCallback(() => setPath({ type: null }), []);
  const [nameError, setNameError] = React.useState<string | null>(null);
  const isBuiltIn = isCustomizableBuiltInIntent(selectedIntent);
  const [trackingEvents] = useTrackingEvents();

  const slotEdit = path.type === 'slot';

  const validateName = (intentName?: string | null) =>
    validateIntentName(
      intentName ?? '',
      allIntents.filter((intent) => intent.id !== intentID),
      slots
    );

  const onBlur = () => {
    const formattedName = Utils.string.removeTrailingUnderscores(name);
    const error = validateName(formattedName);

    setName(formattedName);

    if (error) {
      return setNameError(error);
    }

    setNameError(null);
    patchIntent(intentID, { id: intentID, name: formattedName });
    trackingEvents.trackIntentEdit({ creationType: IntentEditType.IMM });
  };

  const localNameUpdate = (value: string) => {
    setNameError(null);
    setName(applyPlatformIntentAndSlotNameFormatting(value, platform));
  };

  React.useEffect(() => {
    if (selectedIntent) {
      setNameError(validateName(selectedIntent?.name));
    }
  }, [intentID]);

  React.useImperativeHandle(ref, () => ({ resetPath }), []);

  React.useEffect(() => {
    resetPath();
    setName(selectedIntent?.name || '');
  }, [intentID]);

  return !selectedIntent ? null : (
    <>
      <Section>
        <FlexApart onClick={resetPath}>
          <Input
            error={!!nameError}
            value={name}
            onBlur={onBlur}
            disabled={isCustomizableBuiltInIntent(selectedIntent)}
            placeholder="Intent Name"
            onChangeText={localNameUpdate}
          />
          <RemoveDropdown deleteText={isBuiltIn ? 'Remove' : undefined} onRemove={() => removeIntent(intentID)} />
        </FlexApart>

        {nameError && (
          <FadeLeftContainer>
            <ErrorMessage style={{ marginBottom: '0', paddingTop: '10px' }}>{nameError}</ErrorMessage>
          </FadeLeftContainer>
        )}
      </Section>

      <FadeLeftContainer key={(!slotEdit).toString()}>
        {slotEdit ? (
          <StandaloneIntentSlotForm key={intentID} activePath={path} isInModal />
        ) : (
          <IntentForm key={intentID} intent={selectedIntent} pushToPath={setPath} isInModal />
        )}
      </FadeLeftContainer>

      {slotEdit && (
        <Section>
          <ClickableText onClick={resetPath}>Back to Intent</ClickableText>
        </Section>
      )}
    </>
  );
};

const mapStateToProps = {
  slots: SlotV2.allSlotsSelector,
  intent: IntentV2.getIntentByIDSelector,
  allIntents: IntentV2.allIntentsSelector,
  platform: ProjectV2.active.platformSelector,
};

const mapDispatchToProps = {
  patchIntent: Intents.patchIntent,
};

const mergeProps = (
  ...[{ intent: getIntentByID, platform }, , { id }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchToProps, ManagerProps>
) => {
  const intent = getIntentByID({ id });

  return {
    intent: intent ? applySingleIntentNameFormatting(platform, intent) : null,
  };
};

type ConnectedManagerProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;

export default compose(connect(mapStateToProps, mapDispatchToProps, mergeProps, { forwardRef: true }), React.forwardRef)(Manager);
