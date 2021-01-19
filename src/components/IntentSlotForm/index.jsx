import React from 'react';
import { withProps } from 'recompose';

import Badge from '@/components/Badge';
import ChatWithUsLink from '@/components/ChatLink';
import ListManagerWrapper from '@/components/IntentForm/components/ListManagerWrapper';
import ListManager from '@/components/ListManager';
import SSMLWithSlots from '@/components/SSMLWithSlots';
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

function IntentSlotForm({ slot, platform, intentSlot, slotsMap, intent, standalone = false, updateIntentSlot, updateIntentSlotDialog }) {
  const isAlexa = platform === PlatformType.ALEXA;
  const isGeneral = platform === PlatformType.GENERAL;
  const utteranceRef = React.useRef();
  const {
    required,
    dialog: {
      utterances,
      prompt: [{ text: promptText, slots: promptSlots, voice: promptVoice }],
      confirm: [{ text: confirmText, slots: confirmSlots, voice: confirmVoice }],
    },
  } = intentSlot;
  const [isResponseUtteranceEmpty, updateIsResponseUtteranceEmpty] = React.useState(true);

  const variablesSlots = React.useMemo(() => {
    const slotsNameMap = intent.slots.allKeys.reduce((acc, key) => Object.assign(acc, { [key]: slotsMap[key] }), {});
    return Object.values(slotsNameMap);
  }, [intent.slots.allKeys, slotsMap]);

  const onChangePrompt = React.useCallback((prompt) => updateIntentSlotDialog(intent.id, slot.id, { prompt: [{ voice: promptVoice, ...prompt }] }), [
    slot.id,
    intent.id,
    updateIntentSlotDialog,
    promptVoice,
  ]);

  const onChangeConfirm = React.useCallback(
    (confirm) => updateIntentSlotDialog(intent.id, slot.id, { confirm: [{ voice: confirmVoice, ...confirm }] }),
    [slot.id, intent.id, updateIntentSlotDialog, confirmVoice]
  );

  const onChangePromptVoice = React.useCallback(
    (voice) => updateIntentSlotDialog(intent.id, slot.id, { prompt: [{ text: promptText, slots: promptSlots, voice }] }),
    [slot.id, intent.id, updateIntentSlotDialog, promptText, promptSlots]
  );

  const onChangeConfirmVoice = React.useCallback(
    (voice) => updateIntentSlotDialog(intent.id, slot.id, { confirm: [{ text: confirmText, slots: confirmSlots, voice }] }),
    [slot.id, intent.id, updateIntentSlotDialog, confirmText, confirmSlots]
  );

  const onUpdateUtterances = React.useCallback((utterances) => updateIntentSlotDialog(intent.id, slot.id, { utterances }), [
    slot.id,
    intent.id,
    updateIntentSlotDialog,
  ]);

  const addValidation = React.useCallback(({ text }) => ({ valid: !!text }), []);

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
              <SSMLWithSlots
                icon={null}
                voice={promptVoice}
                slots={variablesSlots}
                value={promptText || ''}
                onBlur={onChangePrompt}
                onChangeVoice={onChangePromptVoice}
                placeholder="What question will we ask the user to fill this slot?"
              />
            </FormControl>

            {(isAlexa || isGeneral) && (
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
                              <Badge slide onClick={() => onAdd(utteranceRef.current.getCurrentValue())}>
                                Enter
                              </Badge>
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
                <SSMLWithSlots
                  icon={null}
                  voice={confirmVoice}
                  slots={variablesSlots}
                  value={confirmText || ''}
                  onBlur={onChangeConfirm}
                  onChangeVoice={onChangeConfirmVoice}
                  placeholder="What yes/no question will we ask to confirm the slot?"
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

const ConnectedIntentSlotForm = connect(mapStateToProps, mapDispatchToProps, mergeProps)(IntentSlotForm);

export default ConnectedIntentSlotForm;

export const StandaloneIntentSlotForm = withProps({ standalone: true })(ConnectedIntentSlotForm);
