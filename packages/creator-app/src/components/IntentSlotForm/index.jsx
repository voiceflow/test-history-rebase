import { Constants } from '@voiceflow/alexa-types';
import { Badge, ErrorMessage } from '@voiceflow/ui';
import React from 'react';
import { withProps } from 'recompose';

import ListManagerWrapper from '@/components/IntentForm/components/ListManagerWrapper';
import ListManager from '@/components/ListManager';
import Section, { SectionToggleVariant, UncontrolledSection } from '@/components/Section';
import Utterance from '@/components/Utterance';
import { SlotTag } from '@/components/VariableTag';
import { NamespaceProvider } from '@/contexts';
import * as Intent from '@/ducks/intent';
import * as Project from '@/ducks/project';
import * as Slot from '@/ducks/slot';
import { connect } from '@/hocs';
import { Content, FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { slotToString } from '@/utils/slot';
import { isAlexaPlatform, isAnyGeneralPlatform, isChatbotPlatform } from '@/utils/typeGuards';

import {
  ChatPromptForm,
  ResponseUtterancesTooltip,
  SlotConfirmationTooltip,
  SlotPromptTooltip,
  SlotRequiredMessage,
  VoicePromptForm,
} from './components';

function IntentSlotForm({ slot, platform, intentSlot, slotsMap, intent, standalone = false, updateIntentSlot, updateIntentSlotDialog }) {
  const isAlexa = isAlexaPlatform(platform);
  const isChatbot = isChatbotPlatform(platform);
  const isGeneral = isAnyGeneralPlatform(platform);
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
    const defaultSlotText = slot.type === Constants.SlotType.SEARCHQUERY ? `search ${strSlot}` : strSlot;
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
          isCollapsed={!required}
          isDividerNested={standalone}
          prefix={<SlotTag color={slot.color}>{slot.name}</SlotTag>}
          header={<SlotRequiredMessage required={required} />}
          onClick={() => updateIntentSlot(intent.id, slot.id, { required: !required })}
          collapseVariant={SectionToggleVariant.TOGGLE}
        >
          <Section header="Entity Prompt" tooltip={<SlotPromptTooltip />} isNested dividerIsNested>
            <FormControl>
              {isChatbot ? (
                <ChatPromptForm
                  slots={variablesSlots}
                  prompt={prompt}
                  onChange={onChangePrompt}
                  placeholder="What question will we ask the user to fill this entity?"
                />
              ) : (
                <VoicePromptForm
                  slots={variablesSlots}
                  prompt={prompt}
                  onChange={onChangePrompt}
                  placeholder="What question will we ask the user to fill this entity?"
                />
              )}
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
                                <Badge slide onClick={() => onAdd(utteranceRef.current.getCurrentValue())}>
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
                <VoicePromptForm
                  slots={variablesSlots}
                  prompt={confirm}
                  onChange={onChangeConfirm}
                  placeholder="What yes/no question will we ask to confirm the entity?"
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
  platform: Project.activePlatformSelector,
  slotsMap: Slot.mapSlotsSelector,
  getIntentByID: Intent.intentByIDSelector,
  getIntentSlotByIntentIDSlotID: Intent.intentSlotByIntentIDSlotIDSelector,
};

const mapDispatchToProps = {
  updateIntentSlot: Intent.updateIntentSlot,
  updateIntentSlotDialog: Intent.updateIntentSlotDialog,
};

const mergeProps = ({ slotsMap, getIntentByID, getIntentSlotByIntentIDSlotID }, _, { activePath }) => ({
  slot: slotsMap[activePath.id],
  intent: getIntentByID(activePath.intentID),
  intentSlot: getIntentSlotByIntentIDSlotID(activePath.intentID, activePath.id),
});

const ConnectedIntentSlotForm = connect(mapStateToProps, mapDispatchToProps, mergeProps)(IntentSlotForm);

export default ConnectedIntentSlotForm;

export const StandaloneIntentSlotForm = withProps({ standalone: true })(ConnectedIntentSlotForm);
