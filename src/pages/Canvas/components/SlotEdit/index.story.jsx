import { action } from '@storybook/addon-actions';
import { button } from '@storybook/addon-knobs';
import React from 'react';

import { composeDecorators, withModalContext, withRedux } from '@/../.storybook';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';

import SlotEditModal from './SlotEditModal';

const withDecorators = composeDecorators(
  withRedux({
    skill: {
      name: 'Quiz Master',
      id: '2WdNkEDRaM',
      creatorID: 16093,
      projectID: 'KxdMz8YaRD',
      rootDiagramID: '2345',
      diagramID: '2345',
      platform: 'alexa',
      publishInfo: {
        google: {
          locales: [],
          main_locale: 'en',
          googleId: null,
        },
        alexa: {
          amznID: null,
          vendorId: null,
          review: false,
          live: false,
        },
      },
      locales: ['en-US'],
      globalVariables: ['access_token', 'score'],
      meta: {
        created: '2019-10-01T15:50:16.646Z',
        summary: 'This is a new summary for the skill Quiz Master',
        description: 'This is a new description for the skill Quiz Master\n\n Be sure to leave a 5-star review!',
        keywords: 'quiz',
        invocations: {
          value: ['open Quiz Master', 'start Quiz Master', 'launch Quiz Master'],
        },
        category: 'KNOWLEDGE_AND_TRIVIA',
        purchase: false,
        personal: false,
        copa: false,
        ads: false,
        export: true,
        instructions: 'Sample Instruction',
        stage: 0,
        restart: true,
        intents: [
          {
            key: 'yg5x3VyPlJg3',
            name: 'check_score',
            inputs: [
              {
                slots: [],
                text: "what's the score",
              },
              {
                slots: [],
                text: 'check my score',
              },
              {
                slots: [],
                text: 'score please',
              },
              {
                slots: [],
                text: 'score',
              },
              {
                slots: [],
                text: 'what is the score',
              },
              {
                slots: [],
                text: 'check the score',
              },
              {
                slots: [],
                text: 'what is my score',
              },
              {
                slots: [],
                text: 'whats my score',
              },
              {
                slots: [],
                text: "what's my score",
              },
              {
                slots: [],
                text: 'adsasdasd',
              },
            ],
            open: true,
            _platform: null,
          },
        ],
        slots: [],
        used_intents: ['AMAZON.HelpIntent', 'AMAZON.StopIntent'],
        used_choices: [
          'water falls',
          'water',
          'falls',
          'the waterfall sound',
          'water sound',
          'birds',
          'birds chirping',
          'the birds sounds',
          'bird sounds',
          'yes',
          'no',
          'what sounds',
          'which sounds',
          'how many sounds',
          'sounds',
          'leave the skill',
          'end skill',
          'leave',
        ],
        preview: false,
        fulfillment: {},
        access_token_variable: null,
        alexa_permissions: null,
        alexa_interfaces: null,
        repeat: 100,
        last_save: '2019-10-01T15:50:16.646Z',
        cert_requested: null,
        cert_approved: null,
        google_versions: null,
        deprecated_amzn_id: null,
        invName: 'Quiz Master',
        smallIcon: null,
        largeIcon: null,
        resumePrompt: null,
        errorPrompt: {
          voice: 'Alexa',
          content: '',
        },
        alexaEvents: null,
        accountLinking: null,
        privacyPolicy: null,
        termsAndCond: null,
        updatesDescription: '',
      },
    },
  }),
  withModalContext(ModalType.SLOT_EDIT)
);

export default {
  title: 'Creator/Slot Edit Modal',
  component: SlotEditModal,
  includeStories: [],
};

export const normal = withDecorators(() => {
  const { toggle } = useModals(ModalType.SLOT_EDIT);

  const onCreate = action('onCreate');

  button('open', () => toggle({ onCreate }));

  return <SlotEditModal />;
});
