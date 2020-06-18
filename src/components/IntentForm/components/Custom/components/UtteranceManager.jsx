import cuid from 'cuid';
import React from 'react';

import Badge from '@/components/Badge';
import ChatWithUsLink from '@/components/ChatLink';
import ErrorMessage from '@/components/ErrorPages/ErrorMessage';
import ListManager from '@/components/ListManager';
import { SectionToggleVariant } from '@/components/Section';
import SvgIcon from '@/components/SvgIcon';
import TippyTooltip from '@/components/TippyTooltip';
import Utterance from '@/components/Utterance';
import { FeatureFlag } from '@/config/features';
import { FEATURE_IDS, ModalType } from '@/constants';
import { usePermissions } from '@/contexts';
import * as Intent from '@/ducks/intent';
import * as Slot from '@/ducks/slot';
import { connect } from '@/hocs';
import { useEnableDisable, useFeature, useModals } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { stopPropagation } from '@/utils/dom';
import { validateUtterance } from '@/utils/intent';

import ListManagerWrapper from '../../ListManagerWrapper';
import UtterancesTooltip from './UtterancesTooltip';

function UtteranceManager({ intent, slots, addSlot, updateIntent, intents, isNested }) {
  const intentID = intent.id;

  const utteranceRef = React.useRef();

  const bulkUploadFeature = useFeature(FeatureFlag.BULK_UPLOAD);
  const [canBulkUpload] = usePermissions(FEATURE_IDS.BULK_UPLOAD);
  const [isEmpty, updateIsEmpty] = React.useState(true);
  const { open: openImportBulkDeniedModal } = useModals(ModalType.IMPORT_BULK_DENIED);
  const { open: openUtterancesBulkUploadModal } = useModals(ModalType.IMPORT_UTTERANCES);
  const { toggle: toggleSlotEdit, close: closeSlotEdit, isInStack: slotEditOpen } = useModals(ModalType.SLOT_EDIT);
  const [isValidUtterance, setValidUtterance, setInvalidUtterance] = useEnableDisable(true);

  const onUpdateUtterances = React.useCallback((inputs) => updateIntent(intentID, { inputs }, true), [intentID, updateIntent]);

  const onAddSlot = React.useCallback(
    (name) =>
      new Promise((resolve) => {
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
      }),
    []
  );

  const addValidation = React.useCallback(
    ({ text }) => {
      const error = validateUtterance(text, intentID, intents);

      if (error) {
        setInvalidUtterance();
      } else {
        setValidUtterance();
      }
      return { valid: !error, error };
    },
    [intentID, intents, setInvalidUtterance, setValidUtterance]
  );

  const onBulkUploadClick = () => {
    if (canBulkUpload) {
      openUtterancesBulkUploadModal({
        intentID,
        onUpload: (utterances) => onUpdateUtterances([...intent.inputs, ...utterances]),
      });
    } else {
      openImportBulkDeniedModal();
    }
  };

  return (
    <EditorSection
      skipRerender={slotEditOpen}
      namespace="utterances"
      header="Utterances"
      initialOpen={intent.inputs.length === 0}
      infix={
        bulkUploadFeature.isEnabled ? (
          <TippyTooltip title="Bulk Import">
            <SvgIcon icon="upload" clickable onClick={stopPropagation(onBulkUploadClick)} />
          </TippyTooltip>
        ) : null
      }
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
          <ListManager
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
                        <Badge slide onClick={() => onAdd(utteranceRef.current.getCurrentUtterance())}>
                          Enter
                        </Badge>
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

export default connect(mapStateToProps, mapDispatchToProps)(UtteranceManager);
