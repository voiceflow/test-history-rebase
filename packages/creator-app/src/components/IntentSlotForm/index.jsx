import { AlexaConstants } from '@voiceflow/alexa-types';
import { Badge, ErrorMessage, Tag } from '@voiceflow/ui';
import React from 'react';
import { withProps } from 'recompose';

import ListManagerWrapper from '@/components/IntentForm/components/ListManagerWrapper';
import ListManager from '@/components/ListManager';
import PromptForm from '@/components/PromptForm';
import Section, { SectionToggleVariant, UncontrolledSection } from '@/components/Section';
import Utterance from '@/components/Utterance';
import { NamespaceProvider } from '@/contexts';
import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as SlotV2 from '@/ducks/slotV2';
import { connect } from '@/hocs';
import { Content, FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { slotToString } from '@/utils/slot';
import { isAlexaPlatform, isVoiceflowBasedPlatform } from '@/utils/typeGuards';

import { ResponseUtterancesTooltip, SlotConfirmationTooltip, SlotPromptTooltip, SlotRequiredMessage } from './components';

function IntentSlotForm({ slot, platform, intentSlot, slotsMap, intent, standalone = false, patchIntentSlot, updateIntentSlotDialog }) {
  const isAlexa = isAlexaPlatform(platform);
  const isGeneral = isVoiceflowBasedPlatform(platform);
  const utteranceRef = React.useRef();
  const {
    required,
    dialog: { prompt, confirm, utterances },
  } = intentSlot;
  const [isResponseUtteranceEmpty, updateIsResponseUtteranceEmpty] = React.useState(true);

  const strSlot = slotToString(slot);

  const variablesSlots = React.useMemo(() => {
    const slotsNameMap = intent.slots.allKeys.reduce((acc, key) => Object.assign(acc, { [key]: slotsMap[key] }), {});
    return Object.values(slotsNameMap);
  }, [intent.slots.allKeys, slotsMap]);

  const utterancesWithDefault = React.useMemo(() => {
    const defaultSlotText = slot.type === AlexaConstants.SlotType.SEARCHQUERY ? `search ${strSlot}` : strSlot;
    const utterancesWithoutDefault = utterances.filter(({ text }) => text?.trim() !== defaultSlotText);

    return [...utterancesWithoutDefault, { text: defaultSlotText, slots: [slot.id] }];
  }, [utterances]);

  const onChangePrompt = React.useCallback(
    (prompt) => updateIntentSlotDialog(intent.id, slot.id, { prompt }),
    [slot.id, intent.id, updateIntentSlotDialog]
  );

  const onChangeConfirm = React.useCallback(
    (confirm) => updateIntentSlotDialog(intent.id, slot.id, { confirm }),
    [slot.id, intent.id, updateIntentSlotDialog]
  );

  const onUpdateUtterances = React.useCallback(
    (utterances) => updateIntentSlotDialog(intent.id, slot.id, { utterances }),
    [slot.id, intent.id, updateIntentSlotDialog]
  );

  const addValidation = React.useCallback(
    ({ text }) => {
      const trimmedText = text?.trim();

      if (!trimmedText) {
        return { valid: false };
      }

      if (utterancesWithDefault.some((utterance) => utterance.text?.trim() === trimmedText)) {
        return { valid: false, error: 'The utterance is already defined.' };
      }

      return { valid: true };
    },
    [utterancesWithDefault]
  );

  const Wrapper = standalone ? React.Fragment : Content;

  return (
    <NamespaceProvider value={['slot', slot.id]}>
      <Wrapper>
        <UncontrolledSection
          prefix={<Tag color={slot.color}>{`{${slot.name}}`}</Tag>}
          header={<SlotRequiredMessage required={required} />}
          onClick={() => patchIntentSlot(intent.id, slot.id, { required: !required })}
          isCollapsed={!required}
          hiddenPrefix
          isDividerNested={standalone}
          collapseVariant={SectionToggleVariant.TOGGLE}
          truncatedHeader={false}
        >
          <Section header="Entity Reprompt" tooltip={<SlotPromptTooltip />} isNested dividerIsNested>
            <FormControl>
              <PromptForm
                slots={variablesSlots}
                prompt={prompt}
                onChange={onChangePrompt}
                placeholder="What question will we ask the user to fill this entity?"
              />
            </FormControl>

            {(isAlexa || isGeneral) && (
              <EditorSection
                namespace="responseUtterances"
                header="Response Utterances"
                count={utterancesWithDefault.length}
                tooltip={<ResponseUtterancesTooltip />}
                headerToggle
                isNested
                isDividerNested
                collapseVariant={SectionToggleVariant.ARROW}
              >
                <FormControl>
                  <ListManagerWrapper>
                    <ListManager
                      items={utterancesWithDefault}
                      addToStart
                      beforeAdd={() => utteranceRef.current.forceUpdate()}
                      renderForm={({ value, onAdd, onChange, addError }) => (
                        <>
                          <Utterance
                            ref={utteranceRef}
                            icon="user"
                            space
                            slots={variablesSlots}
                            value={value?.text || ''}
                            onBlur={onChange}
                            onEmpty={updateIsResponseUtteranceEmpty}
                            creatable={false}
                            iconProps={{ variant: 'blue' }}
                            rightAction={
                              !isResponseUtteranceEmpty && (
                                <Badge slide onClick={() => utteranceRef.current && onAdd(utteranceRef.current.getCurrentUtterance())}>
                                  Enter
                                </Badge>
                              )
                            }
                            placeholder="What might the user say to the above question?"
                            onEnterPress={onAdd}
                          />
                          {!!addError && <ErrorMessage>{addError}</ErrorMessage>}
                        </>
                      )}
                      onUpdate={onUpdateUtterances}
                      renderItem={(item, { index, onUpdate }) => (
                        <Utterance
                          space
                          slots={variablesSlots}
                          value={item.text}
                          onBlur={onUpdate}
                          onEnterPress={onUpdate}
                          creatable={false}
                          disabled={index === utterancesWithDefault.length - 1}
                        />
                      )}
                      addValidation={addValidation}
                      requiredItemIndex={utterancesWithDefault.length - 1}
                    />
                  </ListManagerWrapper>
                </FormControl>
              </EditorSection>
            )}
          </Section>

          {required && isAlexa && (
            <UncontrolledSection
              isCollapsed={!intentSlot.dialog.confirmEnabled}
              header="Entity Confirmation"
              tooltip={<SlotConfirmationTooltip />}
              isNested
              onClick={() => updateIntentSlotDialog(intent.id, slot.id, { confirmEnabled: !intentSlot.dialog.confirmEnabled })}
              collapseVariant={SectionToggleVariant.TOGGLE}
            >
              <FormControl>
                <PromptForm.VoiceForm
                  slots={variablesSlots}
                  prompt={confirm}
                  onChange={onChangeConfirm}
                  placeholder="What yes/no question to confirm the entity?"
                />
              </FormControl>
            </UncontrolledSection>
          )}
        </UncontrolledSection>
      </Wrapper>
    </NamespaceProvider>
  );
}

const mapStateToProps = {
  platform: ProjectV2.active.platformSelector,
  projectType: ProjectV2.active.projectTypeSelector,
  slotsMap: SlotV2.slotMapSelector,
  getIntentByID: IntentV2.getIntentByIDSelector,
  getIntentSlotByIntentIDSlotID: IntentV2.getIntentSlotByIntentIDSlotIDSelector,
};

const mapDispatchToProps = {
  patchIntentSlot: Intent.patchIntentSlot,
  updateIntentSlotDialog: Intent.updateIntentSlotDialog,
};

const mergeProps = ({ slotsMap, getIntentByID, getIntentSlotByIntentIDSlotID }, _, { activePath }) => ({
  slot: slotsMap[activePath.id],
  intent: getIntentByID({ id: activePath.intentID }),
  intentSlot: getIntentSlotByIntentIDSlotID(activePath.intentID, activePath.id),
});

const ConnectedIntentSlotForm = connect(mapStateToProps, mapDispatchToProps, mergeProps)(IntentSlotForm);

export default ConnectedIntentSlotForm;

export const StandaloneIntentSlotForm = withProps({ standalone: true })(ConnectedIntentSlotForm);
