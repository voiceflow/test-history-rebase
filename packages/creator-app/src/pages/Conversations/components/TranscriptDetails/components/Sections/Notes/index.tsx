import React from 'react';

import EmojiPicker, { EMOJI_OPTION } from '@/components/EmojiPicker';
import { FAN_DIRECTION } from '@/components/EmojiPicker/constants';
import { addTag, currentTranscriptIDSelector, currentTranscriptSelector, removeTag } from '@/ducks/transcript';
import { useDispatch, useSelector } from '@/hooks';
import { Sentiment, SentimentArray } from '@/models';

import { Container, SectionTitle } from '../components';
import TranscriptNotes from './TranscriptNotes';

const SentimentToEmoji = {
  [Sentiment.EMOTION_NEGATIVE]: EMOJI_OPTION.SAD,
  [Sentiment.EMOTION_POSITIVE]: EMOJI_OPTION.HAPPY,
  [Sentiment.EMOTION_NEUTRAL]: EMOJI_OPTION.NEUTRAL,
};

const EmojiToSentiment = {
  [EMOJI_OPTION.SAD]: Sentiment.EMOTION_NEGATIVE,
  [EMOJI_OPTION.HAPPY]: Sentiment.EMOTION_POSITIVE,
  [EMOJI_OPTION.NEUTRAL]: Sentiment.EMOTION_NEUTRAL,
};

const Notes: React.FC = () => {
  const { reportTags } = useSelector(currentTranscriptSelector) ?? {};
  const currentTranscriptID = useSelector(currentTranscriptIDSelector);
  const dispatchAddTag = useDispatch(addTag);
  const dispatchRemoveTag = useDispatch(removeTag);

  const currentSentiment = React.useMemo(
    () => reportTags?.filter((tag) => SentimentArray.includes(tag as Sentiment)) ?? [],
    [reportTags, currentTranscriptID]
  );
  const selectedEmoji = currentSentiment?.[0] ? SentimentToEmoji[currentSentiment[0] as Sentiment] : null;

  const onChange = async (emotion: EMOJI_OPTION) => {
    if (!currentTranscriptID) return;

    const updateCalls = [];

    if (emotion === EMOJI_OPTION.DEFAULT) {
      await dispatchRemoveTag(currentTranscriptID, currentSentiment[0]);

      return;
    }

    if (currentSentiment[0]) {
      updateCalls.push(dispatchRemoveTag(currentTranscriptID, currentSentiment[0]));
    }

    updateCalls.push(dispatchAddTag(currentTranscriptID, EmojiToSentiment[emotion]));

    await Promise.all(updateCalls);
  };

  return (
    <Container style={{ flex: 4 }} curved>
      <SectionTitle>
        NOTES
        <EmojiPicker
          value={selectedEmoji}
          onChange={onChange}
          fanDirection={FAN_DIRECTION.LEFT}
          options={[EMOJI_OPTION.HAPPY, EMOJI_OPTION.NEUTRAL, EMOJI_OPTION.SAD]}
        />
      </SectionTitle>
      <TranscriptNotes />
    </Container>
  );
};

export default Notes;
