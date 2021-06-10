import React from 'react';

import { Browser, Device, OperatingSystem, Sentiment } from '@/models/Transcript';

import { Container } from '../components';
import { TranscriptContext } from './TranscriptContext';

const MOCK_TRANSCRIPT = {
  id: '1',
  creatorID: 2,
  projectID: 'testproject',
  unread: true,
  device: Device.DESKTOP,
  os: OperatingSystem.MAC,
  browser: Browser.CHROME,
  tags: ['test1', 'test2'],
  notes: 'test note',
  createdAt: 2021,
  sentiment: Sentiment.EMOTION_POSITIVE,
};

const Context = () => (
  <Container topExtend>
    <TranscriptContext transcript={MOCK_TRANSCRIPT}></TranscriptContext>
  </Container>
);

export default Context;
