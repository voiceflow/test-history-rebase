import * as Platform from '@voiceflow/platform-config';
import {
  Box,
  SectionV2,
  stopPropagation,
  StrengthGauge,
  SvgIcon,
  System,
  TippyTooltip,
  toast,
  useDidUpdateEffect,
  useEnableDisable,
  useSetup,
} from '@voiceflow/ui';
import queryString from 'query-string';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import * as GPT from '@/components/GPT';
import ListManager from '@/components/ListManager';
import Utterance, { UtteranceRef } from '@/components/Utterance';
import { PREFILLED_UTTERANCE_PARAM } from '@/constants';
import { Permission } from '@/constants/permissions';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as SlotV2 from '@/ducks/slotV2';
import * as Tracking from '@/ducks/tracking';
import { useMapManager } from '@/hooks/mapManager';
import { usePermissionAction } from '@/hooks/permission';
import { useSelector } from '@/hooks/redux';
import { useAddSlot } from '@/hooks/slot';
import { useTrackingEvents } from '@/hooks/tracking';
import { useBulkImportUtterancesModal, useUpgradeModal } from '@/ModalsV2/hooks';
import { formatUtterance, getIntentStrengthLevel, isDefaultIntentName, validateUtterance } from '@/utils/intent';

import UtteranceInput from './components/UtteranceInput';

interface UtteranceSectionProps {
  inputs: Platform.Base.Models.Intent.Input[];
  intentID: string | null;
  creating?: boolean;
  autofocus?: boolean;
  isBuiltIn?: boolean;
  intentName: string;
  withBorderTop?: boolean;
  onUpdateUtterances: (data: Platform.Base.Models.Intent.Input[]) => void;
  prefilledUtterance?: string;
  utteranceCreationType: Tracking.CanvasCreationType;
  onIntentNameSuggested?: (name: string) => void;
}

const MAX_VISIBLE_UTTERANCES = 10;

const UtteranceSection: React.FC<UtteranceSectionProps> = ({
  inputs,
  intentID,
  isBuiltIn,
  autofocus,
  intentName,
  withBorderTop,
  prefilledUtterance,
  onUpdateUtterances,
  onIntentNameSuggested,
  utteranceCreationType,
}) => {
  const history = useHistory();
  const { search } = useLocation();

  const queryParams = queryString.parse(search);
  const prefilledNewUtterance = prefilledUtterance || (queryParams[PREFILLED_UTTERANCE_PARAM] as string | null);

  const slots = useSelector(SlotV2.allSlotsSelector);
  const intents = useSelector(IntentV2.allIntentsSelector);
  const platform = useSelector(ProjectV2.active.platformSelector);

  const utteranceRef = React.useRef<UtteranceRef>(null);

  const [showAllUtterances, setShowAllUtterances] = React.useState(false);
  const [isEmpty, updateIsEmpty] = React.useState(true);

  const upgradeModal = useUpgradeModal();
  const bulkImportUtterancesModal = useBulkImportUtterancesModal();

  const [isValidUtterance, setValidUtterance, setInvalidUtterance] = useEnableDisable(true);

  const intentUtterances = inputs || [];
  const [trackingEvents] = useTrackingEvents();

  const { onAddSlot } = useAddSlot();

  const addValidation = React.useCallback(
    ({ text }: { text: string }) => {
      const error = validateUtterance(text, null, intents, platform, inputs);

      if (error) {
        setInvalidUtterance();
      } else {
        setValidUtterance();
      }
      return { valid: !error, error };
    },
    [intents, inputs, setInvalidUtterance, setValidUtterance]
  );

  const onBulkUploadClick = usePermissionAction(Permission.BULK_UPLOAD, {
    onAction: async () => {
      try {
        const { utterances } = await bulkImportUtterancesModal.open({ intentID });

        onUpdateUtterances([...intentUtterances, ...utterances]);
      } catch {
        // modal closed
      }
    },

    onPlanForbid: ({ planConfig }) => upgradeModal.openVoid(planConfig.upgradeModal()),
  });

  const onUpdateUtterancesHandler = (intentUtterances: Platform.Base.Models.Intent.Input[]) => {
    const cleanedUtterances = intentUtterances.map((utterance) => {
      const text = formatUtterance(platform, utterance.text);

      if (text !== utterance.text) {
        toast.error('Utterance is not valid');
        return { ...utterance, text };
      }

      return utterance;
    });

    onUpdateUtterances(cleanedUtterances);
  };

  const onBeforeAddUtterance = () => {
    if (intentID) {
      trackingEvents.trackNewUtteranceCreated({ intentID, creationType: utteranceCreationType });
    }

    utteranceRef.current?.forceUpdate();
  };

  useDidUpdateEffect(() => {
    utteranceRef.current?.clear();
  }, [intentID]);

  React.useEffect(() => {
    if (autofocus) {
      utteranceRef.current?.forceFocusToTheEnd();
    }

    if (prefilledNewUtterance) {
      utteranceRef.current?.forceFocusToTheEnd?.();
      updateIsEmpty(false);
    }
  }, [prefilledNewUtterance, utteranceRef]);

  useSetup(() => {
    // Remove the prefilled utterance query param, so on another intent select, the prefill won't persist.
    if (prefilledNewUtterance) {
      const queryParams = new URLSearchParams(search);

      queryParams.delete(PREFILLED_UTTERANCE_PARAM);

      history.replace({ search: queryParams.toString() });
    }
  });

  const gptUtteranceGen = GPT.useGPTGenFeatures();

  const gptGenUtterances = GPT.useGenUtterances({
    inputs: intentUtterances,
    onAccept: (recommended) => onUpdateUtterancesHandler([...intentUtterances, ...recommended]),
    intentName,
    onIntentNameSuggested,
  });

  const gptGenUtterancesManager = useMapManager(gptGenUtterances.items, gptGenUtterances.onReplaceAll);

  const renderMoreUtterancesToggle = ({ size }: { size: number }) => (
    <System.Link.Button onClick={() => setShowAllUtterances(!showAllUtterances)}>
      {showAllUtterances ? 'Hide some utterances' : `Show all utterances (${size})`}
    </System.Link.Button>
  );

  return (
    <SectionV2.Sticky>
      {({ sticked }) => (
        <SectionV2>
          {withBorderTop && !sticked && <SectionV2.Divider />}

          <ListManager
            items={intentUtterances}
            divider={false}
            onUpdate={onUpdateUtterancesHandler}
            beforeAdd={onBeforeAddUtterance}
            addToStart
            initialValue={{ text: prefilledNewUtterance || '', slots: [] }}
            addValidation={addValidation}
            maxVisibleItems={showAllUtterances ? intentUtterances.length : MAX_VISIBLE_UTTERANCES}
            renderItem={(item, { onUpdate }) => (
              <Utterance
                space
                slots={slots}
                value={item?.text}
                onBlur={onUpdate}
                readOnly={!!gptGenUtterances.items.length}
                onAddSlot={onAddSlot}
                onEnterPress={onUpdate}
              />
            )}
            renderList={({ mapManager, itemRenderer }) => (
              <SectionV2.Content px={32} topOffset={mapManager.isEmpty ? 0 : 2} bottomOffset={3}>
                {mapManager.map(itemRenderer)}

                {gptUtteranceGen.isEnabled ? (
                  <Box pt={12}>
                    {gptGenUtterancesManager.map((item, { key, index }) => (
                      <Box mb={12} key={key}>
                        <GPT.Utterance
                          input={item}
                          slots={slots}
                          index={mapManager.size + index + 1}
                          onFocus={() => gptGenUtterances.onFocusItem(index)}
                          isActive={index === gptGenUtterances.activeIndex}
                          onReject={() => gptGenUtterances.onRejectItem(index)}
                          onChange={(data) => gptGenUtterances.onChangeItem(index, { ...item, ...data })}
                          activeIndex={gptGenUtterances.activeIndex}
                        />
                      </Box>
                    ))}

                    {mapManager.size > MAX_VISIBLE_UTTERANCES && <Box mb={16}>{renderMoreUtterancesToggle({ size: mapManager.size })}</Box>}

                    <GPT.GenerateButton.Utterance
                      disabled={!!gptGenUtterances.items.length || gptGenUtterances.fetching}
                      isLoading={gptGenUtterances.fetching}
                      onGenerate={({ quantity }) => gptGenUtterances.onGenerate({ quantity })}
                      hasExtraContext={!isDefaultIntentName(intentName)}
                      contextUtterances={mapManager.items}
                    />
                  </Box>
                ) : (
                  mapManager.size > MAX_VISIBLE_UTTERANCES && <Box pt={16}>{renderMoreUtterancesToggle({ size: mapManager.size })}</Box>
                )}
              </SectionV2.Content>
            )}
            renderForm={({ value, onAdd, onChange, addError, mapManager }) => (
              <SectionV2.Header
                sticky
                column
                sticked={sticked}
                topUnit={2.5}
                bottomUnit={mapManager.isEmpty && gptGenUtterancesManager.isEmpty ? 0 : 2}
                insetBorder={!mapManager.isEmpty || !gptGenUtterancesManager.isEmpty}
              >
                <Box.FlexApart pb={16} width="100%">
                  <Box.Flex gap={16} minHeight="22px">
                    <SectionV2.Title bold secondary>
                      Utterances
                    </SectionV2.Title>

                    <Box mt={2}>
                      <StrengthGauge
                        width={40}
                        level={isBuiltIn ? StrengthGauge.Level.VERY_STRONG : getIntentStrengthLevel(intentUtterances.length)}
                        tooltipLabelMap={{ [StrengthGauge.Level.NOT_SET]: 'No utterances' }}
                      />
                    </Box>
                  </Box.Flex>

                  <Box.Flex gap={16}>
                    <TippyTooltip content="Bulk Import">
                      <SvgIcon
                        icon="upload"
                        onClick={stopPropagation(onBulkUploadClick)}
                        variant={SvgIcon.Variant.STANDARD}
                        clickable
                        reducedOpacity
                      />
                    </TippyTooltip>
                  </Box.Flex>
                </Box.FlexApart>

                <UtteranceInput
                  ref={utteranceRef}
                  slots={slots}
                  value={value}
                  onAdd={onAdd}
                  isEmpty={isEmpty}
                  onChange={onChange}
                  readOnly={!!gptGenUtterances.items.length}
                  addError={addError}
                  onAddSlot={onAddSlot}
                  updateIsEmpty={updateIsEmpty}
                  isValidUtterance={isValidUtterance}
                  setValidUtterance={setValidUtterance}
                />
              </SectionV2.Header>
            )}
          />
        </SectionV2>
      )}
    </SectionV2.Sticky>
  );
};

export default UtteranceSection;
