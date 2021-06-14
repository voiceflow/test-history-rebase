import { Interaction, Message, MessageType } from '@/pages/Prototype/types';

export const MOCK_MESSAGES: Message[] = [
  {
    message:
      'Hi Sam, welcome to Voiceflow Banking! I’m Mia, your personal banking assistant. I can help you with things like transfering funds, or checking account balances.',
    id: '1',
    type: MessageType.SPEAK,
    startTime: '00:01',
  },
  {
    message: 'What can I help you with today?',
    id: '2',
    type: MessageType.SPEAK,
    startTime: '00:02',
  },
  {
    input: 'Transfer funds',
    id: '3',
    type: MessageType.USER,
    startTime: '00:03',
  },
  {
    message: 'Ok, who do you want to send a transfer to?',
    id: '4',
    type: MessageType.SPEAK,
    startTime: '00:04',
  },
  {
    input: "I'd like to send money to Katie.",
    id: '5',
    type: MessageType.USER,
    startTime: '00:07',
  },
  {
    message: 'How much you like to send to Katie?',
    id: '6',
    type: MessageType.SPEAK,
    startTime: '00:08',
  },
  {
    input: ' $75 for dinner the other night',
    id: '7',
    type: MessageType.USER,
    startTime: '00:09',
  },
  {
    message: 'Great, sending Katie Chambers $75 with the note, “For dinner the other night”. Should I send it?',
    id: '8',
    type: MessageType.SPEAK,
    startTime: '00:10',
  },
  {
    input: 'Yes 👍  ',
    id: '9',
    type: MessageType.USER,
    startTime: '00:11',
  },
];
export const MOCK_INTERACTIONS: Interaction[] = [
  {
    name: 'Interaction Test 1',
    request: { type: 'type', payload: undefined },
  },
  {
    name: 'Interaction Test 2',
    request: { type: 'type', payload: undefined },
  },
];
