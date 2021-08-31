import { ClickableText, ErrorMessage, FlexApart, Input } from '@voiceflow/ui';
import React from 'react';

import IntentForm from '@/components/IntentForm';
import { StandaloneIntentSlotForm } from '@/components/IntentSlotForm';
import RemoveDropdown from '@/components/RemoveDropdown';
import Section from '@/components/Section';
import * as Intents from '@/ducks/intent';
import { applySingleIntentNameFormatting } from '@/ducks/intent/utils';
import * as Project from '@/ducks/project';
import * as Slot from '@/ducks/slot';
import { compose, connect } from '@/hocs';
import { FadeLeftContainer } from '@/styles/animations';
import { ConnectedProps, MergeArguments } from '@/types';
import { formatIntentName, isCustomizableBuiltInIntent, prettifyIntentName, validateIntentName } from '@/utils/intent';
import { removeTrailingUnderscores } from '@/utils/string';
import { isGeneralPlatform } from '@/utils/typeGuards';

export interface ManagerProps {
  id: string;
  removeIntent: (id: string) => void;
}

const Manager: React.ForwardRefRenderFunction<{ resetPath: () => void }, ManagerProps & ConnectedManagerProps> = (
  { id, intent: selectedIntent, platform, slots, removeIntent, patchIntent, allIntents },
  ref
) => {
  const isGeneral = isGeneralPlatform(platform);
  const [name, setName] = React.useState(selectedIntent?.name ?? '');
  const [path, setPath] = React.useState<{ type: string | null }>({ type: null });
  const resetPath = React.useCallback(() => setPath({ type: null }), []);
  const [nameError, setNameError] = React.useState<string | null>(null);
  const isBuiltIn = isCustomizableBuiltInIntent(selectedIntent);

  const slotEdit = path.type === 'slot';

  const validateName = (intentName?: string | null) =>
    validateIntentName(
      intentName ?? '',
      allIntents.filter((intent) => intent.id !== selectedIntent.id),
      slots
    );

  const onBlur = () => {
    const formattedName = removeTrailingUnderscores(name);
    const error = validateName(formattedName);

    setName(formattedName);

    if (error) {
      return setNameError(error);
    }

    setNameError(null);
    patchIntent(id, { id, name: formattedName });
  };

  const localNameUpdate = ({ value }: { value: string }) => {
    setNameError(null);
    setName(isGeneral ? value : formatIntentName(value));
  };

  React.useEffect(() => {
    setNameError(validateName(selectedIntent.name));
  }, [selectedIntent.id]);

  React.useImperativeHandle(ref, () => ({ resetPath }), []);

  React.useEffect(() => {
    resetPath();
    setName(selectedIntent?.name || '');
  }, [id]);

  return !selectedIntent ? null : (
    <>
      <Section>
        <FlexApart onClick={resetPath}>
          <Input
            error={!!nameError}
            value={prettifyIntentName(name)}
            onBlur={onBlur}
            onChange={({ currentTarget }) => localNameUpdate(currentTarget)}
            placeholder="Intent Name"
            disabled={isCustomizableBuiltInIntent(selectedIntent)}
          />
          <RemoveDropdown deleteText={isBuiltIn ? 'Remove' : undefined} onRemove={() => removeIntent(id)} />
        </FlexApart>

        {nameError && (
          <FadeLeftContainer>
            <ErrorMessage style={{ marginBottom: '0', paddingTop: '10px' }}>{nameError}</ErrorMessage>
          </FadeLeftContainer>
        )}
      </Section>

      <FadeLeftContainer key={(!slotEdit).toString()}>
        {slotEdit ? <StandaloneIntentSlotForm key={id} activePath={path} /> : <IntentForm key={id} intent={selectedIntent} pushToPath={setPath} />}
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
  slots: Slot.allSlotsSelector,
  intent: Intents.intentByIDSelector,
  allIntents: Intents.allIntentsSelector,
  platform: Project.activePlatformSelector,
};

const mapDispatchToProps = {
  patchIntent: Intents.patchIntent,
};

const mergeProps = (
  ...[{ intent: intentByIDSelector, platform }, , { id }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchToProps, ManagerProps>
) => ({
  intent: applySingleIntentNameFormatting(platform, intentByIDSelector(id)),
});

type ConnectedManagerProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;

export default compose(connect(mapStateToProps, mapDispatchToProps, mergeProps, { forwardRef: true }), React.forwardRef)(Manager);
