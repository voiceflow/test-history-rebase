import React from 'react';

import { Sentiment, Transcript } from '@/models';

import { Container, TranscriptHeader, TranscriptResultsList } from './components';

export const DUMMY_DATA = [
  {
    id: '1',
    name: 'Josh Ho',
    date: '9:39 am, May 1st',
    tags: ['repair path', 'happy path'],
    read: true,
    reviewed: true,
    saved: true,
    sentiment: Sentiment.EMOTION_POSITIVE,
  },
  {
    id: '2',
    name: 'Mike Hood',
    date: '1:79 am, May 2nd',
    tags: ['repair path', 'happy path'],
    read: false,
    reviewed: true,
    saved: true,
  },
  {
    id: '3',
    name: 'Barack Obama',
    date: '1:79 am, May 2nd',
    tags: ['repair path', 'happy path'],
    read: true,
    reviewed: false,
    saved: true,
    sentiment: Sentiment.EMOTION_NEGATIVE,
  },
  {
    id: '4',
    name: 'Donald Trump',
    date: '1:79 am, May 2nd',
    tags: ['repair path', 'happy path'],
    read: false,
    reviewed: true,
    saved: false,
  },
  {
    id: '5',
    name: 'Tyler Han',
    date: '1:79 am, May 2nd',
    tags: ['repair path', 'happy path'],
    read: false,
    reviewed: false,
    saved: false,
  },
  {
    id: '6',
    name: 'Andrew Lawrence',
    date: '1:79 am, May 2nd',
    tags: ['repair path', 'happy path'],
    read: false,
    reviewed: false,
    saved: true,
    sentiment: Sentiment.EMOTION_POSITIVE,
  },
  {
    id: '7',
    name: 'Braden Ream',
    date: '1:79 am, May 2nd',
    tags: ['repair path', 'happy path'],
    read: true,
    reviewed: true,
    saved: true,
  },
];

const TranscriptManager = () => (
  <Container>
    <TranscriptHeader resultCount={DUMMY_DATA.length} />
    <TranscriptResultsList transcriptList={DUMMY_DATA as unknown as Transcript[]} />
  </Container>
);

export default TranscriptManager;
