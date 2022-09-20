import { Utils } from '@voiceflow/common';
import * as ML from '@voiceflow/ml-sdk';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, FullSpinner, IconButton, SectionV2, SidebarEditor, TippyTooltip, toast, useToggle } from '@voiceflow/ui';
import _sample from 'lodash/sample';
import React from 'react';

import Drawer from '@/components/Drawer';
import Utterance, { UtteranceValue } from '@/components/Utterance';
import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as SlotV2 from '@/ducks/slotV2';
import * as VersionV2 from '@/ducks/versionV2';
import { useAddSlot, useDispatch, useMLGatewayClient, useSelector, useTrackingEvents } from '@/hooks';
import { useNLUManager } from '@/pages/NLUManager/context';
import { NLUIntent } from '@/pages/NLUManager/types';
import { fillEntities, validateUtterance } from '@/utils/intent';
import { waitAsyncAction } from '@/utils/logux';

interface Recommendation extends Realtime.IntentInput {
  id: string;
}

const Recommendations: React.FC = () => {
  const mlClient = useMLGatewayClient();
  const nluManager = useNLUManager<NLUIntent>();

  const slots = useSelector(SlotV2.allSlotsSelector);
  const locales = useSelector(VersionV2.active.localesSelector);
  const intents = useSelector(IntentV2.allCustomIntentsSelector);
  const platform = useSelector(ProjectV2.active.platformSelector);
  const slotsMap = useSelector(SlotV2.slotMapSelector);
  const patchIntent = useDispatch(Intent.patchIntent);
  const [trackingEvents] = useTrackingEvents();

  const [isFetching, toggleIsFetching] = useToggle(false);
  const [recommendations, setRecommendations] = React.useState<Recommendation[]>([]);

  const { onAddSlot } = useAddSlot();

  const onFetchRecommendations = async () => {
    const inputs = nluManager.activeItem?.inputs || [];
    const allIntentInputs = new Set(inputs.map((input) => input.text));
    const utterance = _sample(nluManager.activeItem?.inputs ?? []);

    if (!utterance) return;

    try {
      toggleIsFetching(true);

      const recommendedUtterances = await waitAsyncAction(mlClient, ML.utterance.suggest, {
        utterance: fillEntities(utterance.text, { slotsMap, locales, platform }),
        numberOfUtterances: 10,
      });

      setRecommendations(
        recommendedUtterances
          .filter((recommendedUtterance) => !allIntentInputs.has(recommendedUtterance))
          .map((text) => ({ id: Utils.id.cuid.slug(), text, slots: [] }))
      );

      if (nluManager.activeItemID) {
        trackingEvents.trackUtteranceRecommendationRefreshed({ intentID: nluManager.activeItemID });
      }
    } catch {
      toast.warn('Failed to generate recommendations, please try again later');
    } finally {
      toggleIsFetching(false);
    }
  };

  const onUpdateRecommendation = (index: number, value: UtteranceValue) => {
    setRecommendations(Utils.array.replace(recommendations, index, { ...recommendations[index], ...value }));
  };

  const removeRecommendation = (index: number) => {
    setRecommendations(Utils.array.without(recommendations, index));
  };

  const onRemoveRecommendation = (index: number, text: string) => {
    removeRecommendation(index);
    if (!nluManager.activeItemID) return;
    trackingEvents.trackUtteranceRecommendationRejected({ utteranceName: text, intentID: nluManager.activeItemID });
  };

  const onAddRecommendation = (index: number, { text, slots }: Recommendation) => {
    if (!nluManager.activeItem) return;

    const error = validateUtterance(text, nluManager.activeItem.id, intents, platform);

    if (error) {
      toast.error(error);
    }

    patchIntent(nluManager.activeItem.id, { inputs: [...nluManager.activeItem.inputs, { text, slots }] });
    trackingEvents.trackUtteranceRecommendationAccepted({ utteranceName: text, intentID: nluManager.activeItem.id });
    removeRecommendation(index);
  };

  React.useEffect(() => {
    setRecommendations([]);
    onFetchRecommendations();

    if (nluManager.activeItemID) {
      trackingEvents.trackUtteranceRecommendationsOpened({ intentID: nluManager.activeItemID });
    }
  }, []);

  React.useEffect(() => {
    const inputs = nluManager.activeItem?.inputs || [];
    const allIntentInputs = new Set(inputs.map((input) => input.text));
    const filteredRecommendations = recommendations.filter((recommendedUtterance) => !allIntentInputs.has(recommendedUtterance.text));

    if (filteredRecommendations.length !== recommendations.length) {
      setRecommendations(filteredRecommendations);
    }
  }, [nluManager.activeItem?.inputs]);

  return (
    <Drawer open width={450} offset={450} zIndex={19} direction={Drawer.Direction.LEFT}>
      <SidebarEditor.Container>
        <SidebarEditor.Header>
          <SidebarEditor.HeaderTitle fontWeight={600}>Recommendations</SidebarEditor.HeaderTitle>

          {isFetching && <FullSpinner borderLess />}

          <SectionV2.ActionsContainer gap={8}>
            <TippyTooltip title="Refresh">
              <IconButton size={16} icon="arrowSpin" variant={IconButton.Variant.BASIC} onClick={onFetchRecommendations} offsetSize={0} />
            </TippyTooltip>

            <IconButton size={16} icon="close" variant={IconButton.Variant.BASIC} onClick={nluManager.closeEditorTab} offsetSize={0} />
          </SectionV2.ActionsContainer>
        </SidebarEditor.Header>

        <SidebarEditor.Content $fillHeight autoHeight autoHeightMax="100%" hideTracksWhenNotNeeded>
          <SectionV2.Content topOffset={3} bottomOffset={3}>
            <Box.Flex column gap={16}>
              {!isFetching &&
                recommendations.map((recommendation, index) => (
                  <Box.Flex key={recommendation.id} width="100%">
                    <Utterance
                      space
                      slots={slots}
                      value={recommendation.text}
                      onBlur={(value) => onUpdateRecommendation(index, value)}
                      readOnly={isFetching}
                      autoFocus={false}
                      onAddSlot={onAddSlot}
                      onEnterPress={(value) => onUpdateRecommendation(index, value)}
                    />

                    <SectionV2.ActionsContainer gap={4}>
                      <IconButton
                        size={14}
                        icon="close"
                        variant={IconButton.Variant.BASIC}
                        onClick={() => onRemoveRecommendation(index, recommendation.text)}
                        disabled={isFetching}
                        offsetSize={0}
                      />

                      <IconButton
                        size={14}
                        icon="checkSquare"
                        onClick={() => onAddRecommendation(index, recommendation)}
                        variant={IconButton.Variant.BASIC}
                        disabled={isFetching}
                        offsetSize={0}
                      />
                    </SectionV2.ActionsContainer>
                  </Box.Flex>
                ))}
            </Box.Flex>
          </SectionV2.Content>
        </SidebarEditor.Content>
      </SidebarEditor.Container>
    </Drawer>
  );
};

export default Recommendations;
