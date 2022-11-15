import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
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
import queryString from 'query-string';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import ListManager from '@/components/ListManager';
import { ContentContainer, SectionToggleVariant } from '@/components/Section';
import Utterance, { UtteranceRef } from '@/components/Utterance';
import { Permission } from '@/config/permissions';
import { BulkImportLimitDetails } from '@/config/planLimits/bulkImport';
import { ModalType, PREFILLED_UTTERANCE_PARAM } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as SlotV2 from '@/ducks/slotV2';
import { CanvasCreationType } from '@/ducks/tracking/constants';
import { useAddSlot, useDispatch, useModals, usePermission, useSelector, useTrackingEvents } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { isCustomizableBuiltInIntent, validateUtterance } from '@/utils/intent';

import ListManagerWrapper from '../../../ListManagerWrapper';
import UtterancesTooltip from '../UtterancesTooltip';
import { BuiltInIntentMessage } from './components';

interface UtteranceManagerProps {
  intent: Platform.Base.Models.Intent.Model;
  isNested: boolean;
  isInModal: boolean;
}

const UtteranceManager: React.FC<UtteranceManagerProps> = ({ intent, isNested, isInModal, children }) => {
  const { search } = useLocation();
  const queryParams = queryString.parse(search);
  const prefilledNewUtterance = queryParams[PREFILLED_UTTERANCE_PARAM] as string | null;
  const history = useHistory();
  const [trackingEvents] = useTrackingEvents();
  const { isOpened: entityEditOpened } = useModals<{ name: string; onCreate: (slot: Realtime.Slot) => void }>(ModalType.ENTITY_EDIT);

  const slots = useSelector(SlotV2.allSlotsSelector);
  const customIntents = useSelector(IntentV2.allCustomIntentsSelector);
  const focus = useSelector(Creator.creatorFocusSelector);

  const patchIntent = useDispatch(Intent.patchIntent);

  const intentID = intent.id;
  const utteranceRef = React.useRef<UtteranceRef>(null);
  const [canBulkUpload] = usePermission(Permission.BULK_UPLOAD);
  const [isEmpty, updateIsEmpty] = React.useState(true);
  const { open: openUpgradeModal } = useModals(ModalType.UPGRADE_MODAL);
  const { open: openUtterancesBulkUploadModal } = useModals(ModalType.IMPORT_UTTERANCES);
  const [isValidUtterance, setValidUtterance, setInvalidUtterance] = useEnableDisable(true);
  const isBuiltIn = isCustomizableBuiltInIntent(intent);
  const [showUtterances, setShowUtterances] = React.useState(!isBuiltIn || !!intent.inputs?.length || !!prefilledNewUtterance);
  const platform = useSelector(ProjectV2.active.platformSelector);

  const onUpdateUtterances = React.useCallback(
    (inputs) => {
      patchIntent(intentID, { inputs });
    },
    [intentID, patchIntent, isInModal]
  );

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

  const { onAddSlot } = useAddSlot();

  const addValidation = React.useCallback(
    ({ text }) => {
      const error = validateUtterance(text, intentID, customIntents, platform);

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
        onUpload: (utterances: Platform.Base.Models.Intent.Input[]) => {
          trackingEvents.trackUtteranceBulkImport({
            intentID,
            creationType: isInModal ? CanvasCreationType.IMM : CanvasCreationType.EDITOR,
          });
          onUpdateUtterances([...intent.inputs, ...utterances]);
        },
      });
    } else {
      openUpgradeModal({ planLimitDetails: BulkImportLimitDetails });
    }
  };

  // For the side editor collapse
  useDidUpdateEffect(() => {
    if (!focus.isActive && !intent.inputs?.length && !isCustomizableBuiltInIntent(intent)) {
      warnNoUtterances();
    }
  }, [focus.isActive, intent.inputs]);

  const SampleUtteranceMessageContainer = isNested ? React.Fragment : ContentContainer;

  return !showUtterances ? (
    <>
      <SampleUtteranceMessageContainer>
        <BuiltInIntentMessage>
          You do not need to provide any sample utterances for this intent, although you can if you want to{' '}
          <ClickableText onClick={() => setShowUtterances(true)}>extend the intent.</ClickableText>
        </BuiltInIntentMessage>
      </SampleUtteranceMessageContainer>

      {children}
    </>
  ) : (
    <>
      {children}

      <EditorSection
        namespace="utterances"
        header="Utterances"
        initialOpen={intent.inputs.length === 0}
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
              beforeAdd={() => {
                trackingEvents.trackNewUtteranceCreated({
                  intentID,
                  creationType: isInModal ? CanvasCreationType.IMM : CanvasCreationType.EDITOR,
                });
                utteranceRef.current?.forceUpdate();
              }}
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
                      iconProps={{ variant: SvgIcon.Variant.BLUE }}
                      rightAction={
                        !isEmpty && (
                          <Badge slide onClick={() => onAdd(utteranceRef.current?.getCurrentUtterance() ?? null)}>
                            Enter
                          </Badge>
                        )
                      }
                      placeholder={placeholder}
                      onEnterPress={onAdd}
                      error={!isValidUtterance}
                      readOnly={entityEditOpened}
                    />
                    {!isValidUtterance && <ErrorMessage>{addError}</ErrorMessage>}
                  </>
                );
              }}
              addValidation={addValidation}
              onUpdate={onUpdateUtterances}
              renderItem={(item, { onUpdate }) => (
                <Utterance
                  space
                  slots={slots}
                  value={item?.text}
                  onBlur={onUpdate}
                  onEnterPress={onUpdate}
                  onAddSlot={onAddSlot}
                  readOnly={entityEditOpened}
                />
              )}
            />
          </ListManagerWrapper>
        </FormControl>
      </EditorSection>
    </>
  );
};

export default UtteranceManager;
