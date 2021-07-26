import React from 'react';

import EmojiPicker, { EMOJI_OPTION } from '@/components/EmojiPicker';
import { FAN_DIRECTION } from '@/components/EmojiPicker/constants';
import { addTag, currentSelectedTranscriptSelector, currentTranscriptIDSelector, removeTag } from '@/ducks/transcript';
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
  const currentTranscript = useSelector(currentSelectedTranscriptSelector);
  const currentTranscriptID = useSelector(currentTranscriptIDSelector);
  const dispatchAddTag = useDispatch(addTag);
  const dispatchRemoveTag = useDispatch(removeTag);

  const { tags } = currentTranscript;
  const currentSentiment = React.useMemo(() => tags.filter((tag) => SentimentArray.includes(tag as Sentiment)), [tags, currentTranscriptID]);
  const selectedEmoji = currentSentiment?.[0] ? SentimentToEmoji[currentSentiment[0] as Sentiment] : null;

  const onChange = async (emotion: EMOJI_OPTION) => {
    if (emotion === EMOJI_OPTION.DEFAULT) {
      await dispatchRemoveTag(currentTranscriptID!, currentSentiment[0]);
    } else {
      await dispatchAddTag(currentTranscriptID!, EmojiToSentiment[emotion]);
    }
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
