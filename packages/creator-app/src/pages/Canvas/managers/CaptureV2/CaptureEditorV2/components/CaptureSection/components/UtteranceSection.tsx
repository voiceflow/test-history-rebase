import * as Realtime from '@voiceflow/realtime-sdk';
import { Badge, ErrorMessage } from '@voiceflow/ui';
import React from 'react';

import ListManagerWrapper from '@/components/IntentForm/components/ListManagerWrapper';
import ListManager from '@/components/ListManager';
import { SectionToggleVariant } from '@/components/Section';
import Utterance from '@/components/Utterance';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { slotToString } from '@/utils/slot';

interface UtteranceSectionProps {
  slot: Realtime.Slot;
  usedSlots: Realtime.Slot[];
  utterances: Realtime.IntentSlotDialog['utterances'];
  updateUtterances: (utterances: Realtime.IntentSlotDialog['utterances']) => void;
}

const UtteranceSection: React.FC<UtteranceSectionProps> = ({ slot, usedSlots, utterances, updateUtterances }) => {
  const utteranceRef = React.useRef<any>();
  const [isResponseUtteranceEmpty, updateIsResponseUtteranceEmpty] = React.useState(true);

  // always add a default utterance
  React.useEffect(() => {
    const strSlot = slotToString(slot);
    if (!utterances.find(({ text }) => text?.trim() === strSlot)) {
      updateUtterances([...utterances, { text: strSlot, slots: [slot.id] }]);
    }
  }, [utterances]);

  const addValidation = React.useCallback(
    ({ text }) => {
      const trimmedText = text?.trim();
      if (!trimmedText) {
        return { valid: false };
      }
      if (utterances.some((utterance) => utterance.text?.trim() === trimmedText)) {
        return { valid: false, error: 'The utterance is already defined.' };
      }
      return { valid: true };
    },
    [utterances]
  );

  return (
    <EditorSection
      namespace="capture_utterances"
      header="Utterances"
      count={utterances.length}
      tooltip="yeet"
      headerToggle
      isDividerNested
      collapseVariant={SectionToggleVariant.ARROW}
    >
      <FormControl>
        <ListManagerWrapper>
          <ListManager
            items={utterances}
            addToStart
            beforeAdd={() => utteranceRef.current?.forceUpdate()}
            renderForm={({ value, onAdd, onChange, addError }) => (
              <>
                <Utterance
                  ref={utteranceRef}
                  icon="user"
                  space
                  slots={usedSlots}
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
            onUpdate={updateUtterances}
            renderItem={(item, { onUpdate }) => (
              <Utterance space slots={usedSlots} value={item.text} onBlur={onUpdate} onEnterPress={onUpdate} creatable={false} />
            )}
            addValidation={addValidation}
            requiredItemIndex={utterances.length - 1}
          />
        </ListManagerWrapper>
      </FormControl>
    </EditorSection>
  );
};

export default UtteranceSection;
