import { Box, toast } from '@voiceflow/ui-next';
import pluralize from 'pluralize';
import React, { useEffect } from 'react';

import { AIGenerateUtteranceButton } from '@/components/AI/AIGenerateUtteranceButton/AIGenerateUtteranceButton.component';
import { useAIGenerateUtterances } from '@/components/AI/hooks/ai-generate-utterances';
import { Designer } from '@/ducks';
import { useInputAutoFocusKey } from '@/hooks/input.hook';
import { useIsListEmpty } from '@/hooks/list.hook';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { isUtteranceLikeEmpty, utteranceTextFactory } from '@/utils/utterance.util';

import { IntentUtterancesSection } from '../IntentUtterancesSection/IntentUtterancesSection.component';
import type { IIntentEditUtterancesSection } from './IntentEditUtterancesSection.interface';

export const IntentEditUtterancesSection: React.FC<IIntentEditUtterancesSection> = ({ intentID, newUtterances }) => {
  const intentName = useSelector(Designer.Intent.selectors.nameByID, { id: intentID });
  const utterances = useSelector(Designer.Intent.Utterance.selectors.allByIntentID, { intentID });

  const patchOne = useDispatch(Designer.Intent.Utterance.effect.patchOne);
  const createOne = useDispatch(Designer.Intent.Utterance.effect.createOne, intentID);
  const deleteOne = useDispatch(Designer.Intent.Utterance.effect.deleteOne);
  const createMany = useDispatch(Designer.Intent.Utterance.effect.createMany, intentID);

  const aiGenerate = useAIGenerateUtterances({
    examples: utterances,
    intentName: intentName ?? '',
    onGenerated: createMany,
  });

  const [isListEmpty, onListItemEmpty] = useIsListEmpty(utterances, isUtteranceLikeEmpty);
  const [autoFocusKey, setAutoFocusKey] = useInputAutoFocusKey();

  const onUtteranceAdd = async () => {
    const utterance = await createOne({ text: utteranceTextFactory() });

    setAutoFocusKey(utterance.id);
  };

  useEffect(() => {
    if (!newUtterances?.length) return;

    (async () => {
      const result = await createMany(newUtterances.map((text) => ({ text })));

      setAutoFocusKey(result[result.length - 1].id);

      toast.success(`Added ${pluralize('utterance', result.length, true)}`);
    })();
  }, []);

  return (
    <>
      <IntentUtterancesSection
        utterances={utterances}
        autoFocusKey={autoFocusKey}
        onUtteranceAdd={onUtteranceAdd}
        onUtteranceEmpty={onListItemEmpty}
        onUtteranceChange={patchOne}
        onUtteranceDelete={deleteOne}
        autoScrollToTopRevision={autoFocusKey}
      />

      <Box px={16} pb={16}>
        <AIGenerateUtteranceButton
          isLoading={aiGenerate.fetching}
          onGenerate={aiGenerate.onGenerate}
          hasExtraContext={!!intentName || !isListEmpty}
        />
      </Box>
    </>
  );
};
