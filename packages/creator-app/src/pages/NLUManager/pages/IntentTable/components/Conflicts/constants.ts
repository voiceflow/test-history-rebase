import { Conflict } from './types';

export enum DragAndDropTypes {
  UTTERANCE = 'utterance',
  FAKE_DRAG_ITEM = 'fake-drag',
}

// TODO: Dummy data for clarity page testing. Remove once integration is complete.
export const intentNameMap: Record<string, string> = {
  '1djsandsanu': 'Banking Information',
  '12soadnoasun123': 'Talk to Agent',
  '123': 'Products',
  '1234': 'Branch Location',
};

// TODO: Dummy data for clarity page testing. Remove once integration is complete.
export const conflictsData: Record<string, Conflict> = {
  '1': {
    id: '1',
    intentID: '1djsandsanu',
    utterances: {
      '1djsandsanu': [{ sentence: 'talk to an agent', intentID: '1djsandsanu', initialSentence: 'talk to an agent', initialIntentID: '1djsandsanu' }],
      '12soadnoasun123': [
        { sentence: 'talk to agent', intentID: '12soadnoasun123', initialSentence: 'talk to agent', initialIntentID: '12soadnoasun123' },
        { sentence: 'speak to agent', intentID: '12soadnoasun123', initialSentence: 'speak to agent', initialIntentID: '12soadnoasun123' },
      ],
    },
  },
  '2': {
    id: '2',
    intentID: '1djsandsanu',
    utterances: {
      '1djsandsanu': [
        { sentence: 'find product', intentID: '1djsandsanu', initialSentence: 'find product', initialIntentID: '1djsandsanu' },
        { sentence: 'find a product', intentID: '1djsandsanu', initialSentence: 'find a product', initialIntentID: '1djsandsanu' },
      ],
      '123': [
        { sentence: 'products', intentID: '123', initialSentence: 'products', initialIntentID: '123' },
        { sentence: 'see products', intentID: '123', initialSentence: 'see products', initialIntentID: '123' },
        { sentence: 'get products', intentID: '123', initialSentence: 'get products', initialIntentID: '123' },
      ],
      '1234': [
        { sentence: 'find branch', intentID: '1234', initialSentence: 'find branch', initialIntentID: '1234' },
        { sentence: 'find location', intentID: '1234', initialSentence: 'find location', initialIntentID: '1234' },
      ],
    },
  },
};
