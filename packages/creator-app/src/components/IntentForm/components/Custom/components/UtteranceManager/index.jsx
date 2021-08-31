import {
  Badge,
  ClickableText,
  ErrorMessage,
  stopPropagation,
  SvgIcon,
  TippyTooltip,
  toast,
  useDidUpdateEffect,
  useEnableDisable,
  useSetup,
} from '@voiceflow/ui';
import cuid from 'cuid';
import queryString from 'query-string';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import ListManager from '@/components/ListManager';
import { ContentContainer, SectionToggleVariant } from '@/components/Section';
import Utterance from '@/components/Utterance';
import { Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as Intent from '@/ducks/intent';
import * as Slot from '@/ducks/slot';
import { connect } from '@/hocs';
import { useModals, usePermission } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { isCustomizableBuiltInIntent, validateUtterance } from '@/utils/intent';

import ListManagerWrapper from '../../../ListManagerWrapper';
import UtterancesTooltip from '../UtterancesTooltip';
import { BuiltInIntentMessage } from './components';

export const PREFILLED_UTTERANCE_PARAM = 'utterance';

function UtteranceManager({ intent, focus, slots, addSlot, patchIntent, customIntents, isNested }) {
  const { search } = useLocation();
  const queryParams = queryString.parse(search);
  const prefilledNewUtterance = queryParams[PREFILLED_UTTERANCE_PARAM];
  const history = useHistory();

  const intentID = intent.id;
  const utteranceRef = React.useRef();
  const [canBulkUpload] = usePermission(Permission.BULK_UPLOAD);
  const [isEmpty, updateIsEmpty] = React.useState(true);
  const { open: openImportBulkDeniedModal } = useModals(ModalType.IMPORT_BULK_DENIED);
  const { open: openUtterancesBulkUploadModal } = useModals(ModalType.IMPORT_UTTERANCES);
  const { toggle: toggleSlotEdit, close: closeSlotEdit, isInStack: slotEditOpen } = useModals(ModalType.SLOT_EDIT);
  const { isOpened: interactionModelInstance } = useModals(ModalType.INTERACTION_MODEL);
  const [isValidUtterance, setValidUtterance, setInvalidUtterance] = useEnableDisable(true);
  const isBuiltIn = isCustomizableBuiltInIntent(intent);
  const [showUtterances, setShowUtterances] = React.useState(!isBuiltIn || !!intent.inputs?.length || !!prefilledNewUtterance);
  const onUpdateUtterances = React.useCallback((inputs) => patchIntent(intentID, { inputs }), [intentID, patchIntent]);

  React.useEffect(() => {
    if (prefilledNewUtterance) {
      utteranceRef.current?.forceFocusToTheEnd?.();
      updateIsEmpty(false);
    }
  }, [prefilledNewUtterance, utteranceRef]);

  const warnNoUtterances = () => {
    toast.warn(`Your intent (${intent.name}) has no utterances. Add utterances to make your intent triggerable.`);
  };

  useSetup(() => {
    // Remove the prefilled utterance query param, so on another intent select, the prefill won't persist.
    if (prefilledNewUtterance) {
      const queryParams = new URLSearchParams(search);
      queryParams.delete(PREFILLED_UTTERANCE_PARAM);
      history.replace({
        search: queryParams.toString(),
      });
    }
  });

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
      const error = validateUtterance(text, intentID, customIntents);

      if (error) {
        setInvalidUtterance();
      } else {
        setValidUtterance();
      }
      return { valid: !error, error };
    },
    [intentID, customIntents, setInvalidUtterance, setValidUtterance]
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

  // For the side editor collapse
  useDidUpdateEffect(() => {
    if (!focus.isActive && !intent.inputs?.length && !isCustomizableBuiltInIntent(intent)) {
      warnNoUtterances();
    }
  }, [focus.isActive, intent.inputs]);

  const SampleUtteranceMessageContainer = isNested ? React.Fragment : ContentContainer;

  return (
    <>
      {!showUtterances ? (
        <SampleUtteranceMessageContainer>
          <BuiltInIntentMessage>
            You do not need to provide any sample utterances for this intent, although you can if you want to{' '}
            <ClickableText onClick={() => setShowUtterances(true)}>extend the intent.</ClickableText>
          </BuiltInIntentMessage>
        </SampleUtteranceMessageContainer>
      ) : (
        <EditorSection
          skipRerender={slotEditOpen}
          namespace="utterances"
          header="Utterances"
          initialOpen={intent.inputs.length === 0 || interactionModelInstance}
          infix={
            <TippyTooltip title="Bulk Import">
              <SvgIcon icon="upload" clickable onClick={stopPropagation(onBulkUploadClick)} />
            </TippyTooltip>
          }
          count={intent.inputs.length}
          tooltip={<UtterancesTooltip />}
          headerToggle
          isNested={isNested}
          isDividerNested
          collapseVariant={SectionToggleVariant.ARROW}
        >
          <FormControl>
            <ListManagerWrapper>
              <ListManager
                items={intent.inputs}
                addToStart
                initialValue={prefilledNewUtterance ? { text: prefilledNewUtterance, slots: [] } : null}
                beforeAdd={() => utteranceRef.current?.forceUpdate()}
                renderForm={({ value, onAdd, onChange, addError }) => {
                  const placeholder = intent.inputs.length ? 'Add synonyms, {} to add entities' : 'What might the user say to invoke this intent?';
                  return (
                    <>
                      <Utterance
                        noSlots={isCustomizableBuiltInIntent(intent)}
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
                            <Badge
                              slide
                              onClick={() => {
                                onAdd(utteranceRef.current?.getCurrentUtterance());
                              }}
                            >
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
                  <Utterance
                    noSlots={isCustomizableBuiltInIntent(intent)}
                    space
                    slots={slots}
                    value={item.text}
                    onBlur={onUpdate}
                    onEnterPress={onUpdate}
                    onAddSlot={onAddSlot}
                  />
                )}
              />
            </ListManagerWrapper>
          </FormControl>
        </EditorSection>
      )}
    </>
  );
}

const mapStateToProps = {
  slots: Slot.allSlotsSelector,
  customIntents: Intent.allCustomIntentsSelector,
  focus: Creator.creatorFocusSelector,
};

const mapDispatchToProps = {
  addSlot: Slot.addSlot,
  patchIntent: Intent.patchIntent,
};

export default connect(mapStateToProps, mapDispatchToProps)(UtteranceManager);
