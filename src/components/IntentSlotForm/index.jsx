import React from 'react';
import { withProps } from 'recompose';

import ChatWithUsLink from '@/components/ChatLink';
import AddUtteranceRightAction from '@/components/IntentForm/components/AddUtteranceRightAction';
import ListManagerWrapper from '@/components/IntentForm/components/ListManagerWrapper';
import ListManager from '@/components/ListManager';
import Section, { SectionToggleVariant, UncontrolledSection } from '@/components/Section';
import Utterance from '@/components/Utterance';
import { SlotTag } from '@/components/VariableTag';
import { PlatformType } from '@/constants';
import { NamespaceProvider } from '@/contexts';
import * as Intent from '@/ducks/intent';
import { activePlatformSelector } from '@/ducks/skill';
import * as Slot from '@/ducks/slot';
import { connect } from '@/hocs';
import { Content, FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';

import { ResponseUtterancesTooltip, SlotConfirmationTooltip, SlotPromptTooltip, SlotRequiredMessage } from './components';

function IntentSlotForm({ slot, platform, intentSlot, slotsMap, intent, isCommand, updateIntentSlot, updateIntentSlotDialog }) {
  const isAlexa = platform === PlatformType.ALEXA;
  const utteranceRef = React.useRef();
  const {
    required,
    dialog: {
      utterances,
      prompt: [{ text: promptText }],
      confirm: [{ text: confirmText }],
    },
  } = intentSlot;
  const [isResponseUtteranceEmpty, updateIsResponseUtteranceEmpty] = React.useState(true);

  const variablesSlots = React.useMemo(() => {
    const slotsNameMap = intent.slots.allKeys.reduce((acc, key) => Object.assign(acc, { [key]: slotsMap[key] }), {});
    return Object.values(slotsNameMap);
  }, [intent.slots.allKeys, slotsMap]);

  const onChangePrompt = React.useCallback((prompt) => updateIntentSlotDialog(intent.id, slot.id, { prompt: [prompt] }), [
    slot.id,
    intent.id,
    updateIntentSlotDialog,
  ]);

  const onChangeConfirm = React.useCallback((confirm) => updateIntentSlotDialog(intent.id, slot.id, { confirm: [confirm] }), [
    slot.id,
    intent.id,
    updateIntentSlotDialog,
  ]);

  const onUpdateUtterances = React.useCallback((utterances) => updateIntentSlotDialog(intent.id, slot.id, { utterances }), [
    slot.id,
    intent.id,
    updateIntentSlotDialog,
  ]);

  const addValidation = React.useCallback(({ text }) => ({ valid: !!text }), []);

  const Wrapper = isCommand ? React.Fragment : Content;

  return (
    <NamespaceProvider value={['slot', slot.id]}>
      <Wrapper>
        <UncontrolledSection
          isCollapsed={!required}
          prefix={<SlotTag color={slot.color}>{slot.name}</SlotTag>}
          header={<SlotRequiredMessage required={required} />}
          onClick={() => updateIntentSlot(intent.id, slot.id, { required: !required })}
          collapseVariant={SectionToggleVariant.TOGGLE}
        >
          <Section
            header="Slot Prompt"
            tooltip={<SlotPromptTooltip />}
            tooltipProps={{
              helpTitle: 'Not getting it?',
              helpMessage: (
                <>
                  That’s cool, <ChatWithUsLink>start a live chat</ChatWithUsLink> with someone on the Voiceflow team.
                </>
              ),
            }}
            isNested
            dividerIsNested
          >
            <FormControl>
              <Utterance
                space
                slots={variablesSlots}
                value={promptText || ''}
                onBlur={onChangePrompt}
                creatable={false}
                placeholder="What question will we ask the user to fill this slot?"
                dividerIsNested
              />
            </FormControl>

            {isAlexa && (
              <EditorSection
                namespace="responseUtterances"
                header="Response Utterances"
                count={utterances.length}
                tooltip={<ResponseUtterancesTooltip />}
                headerToggle
                tooltipProps={{
                  helpMessage: (
                    <>
                      <ChatWithUsLink>Live chat</ChatWithUsLink> with someone on the Voiceflow team.
                    </>
                  ),
                }}
                isNested
                isDividerNested
                collapseVariant={SectionToggleVariant.ARROW}
              >
                <FormControl>
                  <ListManagerWrapper>
                    <ListManager
                      items={utterances}
                      addToStart
                      beforeAdd={() => utteranceRef.current.forceUpdate()}
                      renderForm={({ value, onAdd, onChange }) => (
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
                              <AddUtteranceRightAction onClick={() => onAdd(utteranceRef.current.getCurrentValue())}>Enter</AddUtteranceRightAction>
                            )
                          }
                          placeholder="What might the user say to the above question?"
                          onEnterPress={onAdd}
                          addValidation={addValidation}
                        />
                      )}
                      onUpdate={onUpdateUtterances}
                      renderItem={(item, { onUpdate }) => (
                        <Utterance space slots={variablesSlots} value={item.text} onBlur={onUpdate} onEnterPress={onUpdate} creatable={false} />
                      )}
                    />
                  </ListManagerWrapper>
                </FormControl>
              </EditorSection>
            )}
          </Section>

          {required && isAlexa && (
            <UncontrolledSection
              isCollapsed={!intentSlot.dialog.confirmEnabled}
              header="Slot Confirmation"
              tooltip={<SlotConfirmationTooltip />}
              tooltipProps={{
                helpTitle: 'Not getting it?',
                helpMessage: (
                  <>
                    That’s cool, <ChatWithUsLink>start a live chat</ChatWithUsLink> with someone on the Voiceflow team.
                  </>
                ),
              }}
              isNested
              onClick={() => updateIntentSlotDialog(intent.id, slot.id, { confirmEnabled: !intentSlot.dialog.confirmEnabled })}
              collapseVariant={SectionToggleVariant.TOGGLE}
            >
              <FormControl>
                <Utterance
                  space
                  slots={variablesSlots}
                  value={confirmText || ''}
                  onBlur={onChangeConfirm}
                  creatable={false}
                  placeholder="What yes/no question will we ask to confirm the slot?"
                  dividerIsNested
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
  platform: activePlatformSelector,
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

const ConnectedIntentSlotForm = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(IntentSlotForm);

export default ConnectedIntentSlotForm;

export const StandaloneIntentSlotForm = withProps({ isCommand: true })(ConnectedIntentSlotForm);
