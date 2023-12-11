import type { Utterance, UtteranceText } from '@voiceflow/dtos';
import { Box, toast } from '@voiceflow/ui-next';
import { getMarkupEntityIDs } from '@voiceflow/utils-designer';
import pluralize from 'pluralize';
import React, { useEffect } from 'react';

import { AIGenerateUtteranceButton } from '@/components/AI/AIGenerateUtteranceButton/AIGenerateUtteranceButton.component';
import { useAIGenerateUtterances } from '@/components/AI/hooks/ai-generate-utterances';
import { Designer } from '@/ducks';
import { useInputAutoFocusKey } from '@/hooks/input.hook';
import { useIsListEmpty } from '@/hooks/list.hook';
import { useDispatch, useGetValueSelector, useSelector } from '@/hooks/store.hook';
import { isUtteranceLikeEmpty, utteranceTextFactory } from '@/utils/utterance.util';

import { IntentUtterancesSection } from '../IntentUtterancesSection/IntentUtterancesSection.component';
import type { IIntentEditUtterancesSection } from './IntentEditUtterancesSection.interface';

export const IntentEditUtterancesSection: React.FC<IIntentEditUtterancesSection> = ({
  intent,
  newUtterances,
  utterancesError,
  resetUtterancesError,
}) => {
  const utterances = useSelector(Designer.Intent.Utterance.selectors.allByIntentID, { intentID: intent.id });
  const getRequiredEntitiesByIDs = useGetValueSelector(Designer.Intent.RequiredEntity.selectors.allByIDs);

  const patchOne = useDispatch(Designer.Intent.Utterance.effect.patchOne);
  const createOne = useDispatch(Designer.Intent.Utterance.effect.createOne, intent.id);
  const deleteOne = useDispatch(Designer.Intent.Utterance.effect.deleteOne);
  const createMany = useDispatch(Designer.Intent.Utterance.effect.createMany, intent.id);
  const createManyRequiredEntities = useDispatch(Designer.Intent.RequiredEntity.effect.createMany);

  const aiGenerate = useAIGenerateUtterances({
    examples: utterances,
    intentName: intent.name,
    onGenerated: createMany,
    successGeneratedMessage: 'Utterances generated successfully',
  });

  const listEmpty = useIsListEmpty(utterances, isUtteranceLikeEmpty);
  const autofocus = useInputAutoFocusKey();

  const onUtteranceAdd = async () => {
    const utterance = await createOne({ text: utteranceTextFactory() });

    autofocus.setKey(utterance.id);
  };

  const createRequiredEntitiesForUtterances = async (texts: UtteranceText[]) => {
    const existingEntityIDs = new Set(getRequiredEntitiesByIDs({ ids: intent.entityOrder }).map(({ entityID }) => entityID));

    const newEntityIDs = texts.flatMap(getMarkupEntityIDs).filter((id) => !existingEntityIDs.has(id));

    if (!newEntityIDs.length) return;

    await createManyRequiredEntities(newEntityIDs.map((entityID) => ({ intentID: intent.id, entityID })));
  };

  const onUtteranceChange = async (id: string, data: Pick<Utterance, 'text'>) => {
    resetUtterancesError?.();

    await patchOne(id, data);
    await createRequiredEntitiesForUtterances([data.text]);
  };

  useEffect(() => {
    if (!newUtterances?.length) return;

    (async () => {
      const result = await createMany(newUtterances.map((text) => ({ text })));

      await createRequiredEntitiesForUtterances(newUtterances);

      autofocus.setKey(result[result.length - 1].id);

      toast.success(`Added ${pluralize('utterance', result.length, true)}`);
    })();
  }, []);

  return (
    <>
      <IntentUtterancesSection
        utterances={utterances}
        autoFocusKey={autofocus.key}
        onUtteranceAdd={onUtteranceAdd}
        utterancesError={utterancesError}
        onUtteranceEmpty={listEmpty.container}
        onUtteranceChange={onUtteranceChange}
        onUtteranceRemove={deleteOne}
        autoScrollToTopRevision={autofocus.key}
      />

      {!!utterances.length && (
        <Box pt={8} px={16} pb={16}>
          <AIGenerateUtteranceButton
            isLoading={aiGenerate.fetching}
            onGenerate={aiGenerate.onGenerate}
            hasExtraContext={!!intent.name || !listEmpty.value}
          />
        </Box>
      )}
    </>
  );
};
