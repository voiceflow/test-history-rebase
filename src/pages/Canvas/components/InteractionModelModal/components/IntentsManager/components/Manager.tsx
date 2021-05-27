import React from 'react';

import ErrorMessage from '@/components/ErrorPages/ErrorMessage';
import { FlexApart } from '@/components/Flex';
import Input from '@/components/Input';
import IntentForm from '@/components/IntentForm';
import { StandaloneIntentSlotForm } from '@/components/IntentSlotForm';
import RemoveDropdown from '@/components/RemoveDropdown';
import Section from '@/components/Section';
import { ClickableText } from '@/components/Text';
import * as Intents from '@/ducks/intent';
import { applySingleIntentNameFormatting } from '@/ducks/intent/utils';
import * as Project from '@/ducks/project';
import * as Slot from '@/ducks/slot';
import { compose, connect } from '@/hocs';
import { FadeLeftContainer } from '@/styles/animations';
import { ConnectedProps, MergeArguments } from '@/types';
import { formatIntentName, isCustomizeableBuiltInIntent, validateIntentName } from '@/utils/intent';
import { removeTrailingUnderscores } from '@/utils/string';
import { isAlexaPlatform } from '@/utils/typeGuards';

export type ManagerProps = {
  id: string;
  removeIntent: (id: string) => void;
};

const Manager: React.ForwardRefRenderFunction<{ resetPath: () => void }, ManagerProps & ConnectedManagerProps> = (
  { id, intent: selectedIntent, platform, slots, removeIntent, updateIntent, allIntents },
  ref
) => {
  const isAlexa = isAlexaPlatform(platform);
  const [name, setName] = React.useState(selectedIntent?.name ?? '');
  const [path, setPath] = React.useState<{ type: string | null }>({ type: null });
  const resetPath = React.useCallback(() => setPath({ type: null }), []);
  const [nameError, setNameError] = React.useState<string | null>(null);
  const isBuiltIn = isCustomizeableBuiltInIntent(selectedIntent);

  const slotEdit = path.type === 'slot';

  const validateName = (intentName: string) =>
    validateIntentName(
      intentName,
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
    updateIntent(id, { id, name: formattedName }, true);
  };

  const localNameUpdate = ({ value }: { value: string }) => {
    setNameError(null);
    setName(isAlexa ? formatIntentName(value) : value);
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
            value={name}
            onBlur={onBlur}
            onChange={({ currentTarget }) => localNameUpdate(currentTarget)}
            placeholder="Intent Name"
            disabled={isCustomizeableBuiltInIntent(selectedIntent)}
          />
          <RemoveDropdown deleteText={isBuiltIn ? 'Remove' : undefined} onRemove={() => removeIntent(id)} />
        </FlexApart>

        {nameError && (
          <FadeLeftContainer>
            <ErrorMessage style={{ marginBottom: '0px', paddingTop: '10px' }}>{nameError}</ErrorMessage>
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
  updateIntent: Intents.updateIntent,
};

const mergeProps = (
  ...[{ intent: intentByIDSelector, platform }, , { id }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchToProps, ManagerProps>
) => ({
  intent: applySingleIntentNameFormatting(intentByIDSelector(id), platform),
});

type ConnectedManagerProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;

export default compose(connect(mapStateToProps, mapDispatchToProps, mergeProps, { forwardRef: true }), React.forwardRef)(Manager);
