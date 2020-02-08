import cuid from 'cuid';
import React from 'react';

import ChatWithUsLink from '@/componentsV2/ChatLink';
import ListManagerV2 from '@/componentsV2/ListManagerV2';
import { SectionToggleVariant } from '@/componentsV2/Section';
import Utterance from '@/componentsV2/Utterance';
import { MODALS } from '@/constants';
import { FormControl } from '@/containers/CanvasV2/components/Editor';
import EditorSection from '@/containers/CanvasV2/components/EditorSection';
import ErrorMessage from '@/containers/CanvasV2/components/ErrorMessage';
import { useModals } from '@/contexts/ModalsContext';
import * as Intent from '@/ducks/intent';
import * as Slot from '@/ducks/slot';
import { connect } from '@/hocs';
import { useEnableDisable } from '@/hooks';

import AddUtteranceRightAction from '../../AddUtteranceRightAction';
import ListManagerWrapper from '../../ListManagerWrapper';
import { validateUtterance } from '../utils';
import UtterancesTooltip from './UtterancesTooltip';

function UtteranceManager({ intent, slots, addSlot, updateIntent, intents, isNested }) {
  const intentID = intent.id;

  const utteranceRef = React.useRef();

  const [isEmpty, updateIsEmpty] = React.useState(true);
  const { toggle: toggleSlotEdit, close: closeSlotEdit } = useModals(MODALS.SLOT_EDIT);
  const [isValidUtterance, setValidUtterance, setInvalidUtterance] = useEnableDisable(true);

  const onUpdateUtterances = React.useCallback((inputs) => updateIntent(intentID, { inputs }, true), [intentID, updateIntent]);

  const onAddSlot = React.useCallback(
    (name) => {
      return new Promise((resolve) => {
        toggleSlotEdit(
          {
            name,
            isCreate: true,
            onSave: async ({ type, name, color, inputs = [] }) => {
              const id = cuid.slug();

              resolve({ id, name, color });

              await addSlot(id, { id, type, name, color, inputs });

              closeSlotEdit();
            },
          },
          () => resolve()
        );
      });
    },
    [toggleSlotEdit, closeSlotEdit, addSlot]
  );

  const addValidation = React.useCallback(
    ({ text }) => {
      const error = validateUtterance(text, intents, intentID);
      if (error) {
        setInvalidUtterance();
      } else {
        setValidUtterance();
      }
      return { valid: !error, error };
    },
    [intentID, intents, setInvalidUtterance, setValidUtterance]
  );

  return (
    <EditorSection
      namespace="utterances"
      header="Utterances"
      initialOpen={intent.inputs.length === 0}
      count={intent.inputs.length}
      tooltip={<UtterancesTooltip />}
      headerToggle
      isNested={isNested}
      tooltipProps={{
        helpMessage: (
          <>
            <ChatWithUsLink>Live chat</ChatWithUsLink> with someone on the Voiceflow team.
          </>
        ),
      }}
      isDividerNested
      collapseVariant={SectionToggleVariant.ARROW}
    >
      <FormControl>
        <ListManagerWrapper>
          <ListManagerV2
            items={intent.inputs}
            addToStart
            beforeAdd={() => utteranceRef.current.forceUpdate()}
            renderForm={({ value, onAdd, onChange, items, addError }) => {
              const placeholder = items.length ? 'Add synonyms of the user response' : 'What might the user say to invoke this intent?';

              return (
                <>
                  <Utterance
                    ref={utteranceRef}
                    space
                    icon="user"
                    slots={slots}
                    value={value?.text || ''}
                    onBlur={onChange}
                    onEmpty={updateIsEmpty}
                    onAddSlot={onAddSlot}
                    iconProps={{ variant: 'blue' }}
                    rightAction={
                      !isEmpty && (
                        <AddUtteranceRightAction onClick={() => onAdd(utteranceRef.current.getCurrentUtterance())}>Enter</AddUtteranceRightAction>
                      )
                    }
                    placeholder={placeholder}
                    onEnterPress={onAdd}
                    error={!isValidUtterance}
                  />
                  {!isValidUtterance && <ErrorMessage>{addError}</ErrorMessage>}
                </>
              );
            }}
            addValidation={addValidation}
            onUpdate={onUpdateUtterances}
            renderItem={(item, { onUpdate }) => (
              <Utterance space slots={slots} value={item.text} onBlur={onUpdate} onEnterPress={onUpdate} onAddSlot={onAddSlot} />
            )}
          />
        </ListManagerWrapper>
      </FormControl>
    </EditorSection>
  );
}

const mapStateToProps = {
  slots: Slot.allSlotsSelector,
  intents: Intent.allIntentsSelector,
};

const mapDispatchToProps = {
  addSlot: Slot.addSlot,
  updateIntent: Intent.updateIntent,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UtteranceManager);
