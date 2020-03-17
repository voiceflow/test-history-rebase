import React from 'react';

import { composeDecorators, withDnD, withModalContext, withRedux } from '@/../.storybook';
import { ToastContainer } from '@/components/Toast';
import { ModalType } from '@/constants';
import { OverlayProvider } from '@/contexts/OverlayContext';

import InteractionModelModal from '.';

const createStory = () =>
  composeDecorators(
    withDnD,
    withRedux({
      skill: {
        globalVariables: ['access_token', 'ddd'],
      },
      intent: {
        allKeys: ['wxdu3mdb', 'det83mbe', 'idua3mti'],
        byKey: {
          wxdu3mdb: {
            id: 'wxdu3mdb',
            name: 'order_pizza',
            slots: {
              allKeys: ['l5e23muh', 'g1e83meg', '4ced3msr'],
              byKey: {
                l5e23muh: {
                  dialog: {
                    confirm: [
                      {
                        slots: [],
                        text: null,
                      },
                    ],
                    utterances: [
                      {
                        slots: ['l5e23muh'],
                        text: '{{[type].l5e23muh}} please',
                      },
                      {
                        slots: ['l5e23muh'],
                        text: 'I want {{[type].l5e23muh}} ',
                      },
                      {
                        slots: ['l5e23muh'],
                        text: '{{[type].l5e23muh}} ',
                      },
                    ],
                    confirmEnabled: false,
                    prompt: [
                      {
                        slots: [],
                        text: 'what type of pizza would you like?',
                      },
                    ],
                  },
                  required: true,
                  id: 'l5e23muh',
                },
                g1e83meg: {
                  dialog: {
                    confirm: [
                      {
                        slots: [],
                        text: null,
                      },
                    ],
                    utterances: [
                      {
                        slots: ['g1e83meg'],
                        text: 'make it a {{[size].g1e83meg}} ',
                      },
                      {
                        slots: ['g1e83meg'],
                        text: 'I want {{[size].g1e83meg}} ',
                      },
                      {
                        slots: ['g1e83meg'],
                        text: '{{[size].g1e83meg}} ',
                      },
                    ],
                    confirmEnabled: false,
                    prompt: [
                      {
                        slots: [],
                        text: 'what size would you like?',
                      },
                    ],
                  },
                  required: true,
                  id: 'g1e83meg',
                },
                '4ced3msr': {
                  dialog: {
                    confirm: [
                      {
                        slots: ['4ced3msr'],
                        text: "I've got {{[method].4ced3msr}} right?",
                      },
                    ],
                    utterances: [
                      {
                        slots: ['4ced3msr'],
                        text: 'for {{[method].4ced3msr}} ',
                      },
                      {
                        slots: ['4ced3msr'],
                        text: '{{[method].4ced3msr}} ',
                      },
                    ],
                    confirmEnabled: true,
                    prompt: [
                      {
                        text: 'and is this for pickup or delivery?',
                        slots: [],
                      },
                    ],
                  },
                  required: true,
                  id: '4ced3msr',
                },
              },
            },
            inputs: [
              {
                text: 'pizza time',
                slots: [],
              },
              {
                text: 'get me a pizza',
                slots: [],
              },
              {
                text: 'I want to order a pizza',
                slots: [],
              },
              {
                text: 'order pizza',
                slots: [],
              },
              {
                text: 'I want a {{[size].g1e83meg}} {{[type].l5e23muh}} pizza for {{[method].4ced3msr}} ',
                slots: ['g1e83meg', 'l5e23muh', '4ced3msr'],
              },
              {
                text: 'I want a {{[size].g1e83meg}} {{[type].l5e23muh}} pizza',
                slots: ['g1e83meg', 'l5e23muh'],
              },
              {
                text: 'I want a {{[size].g1e83meg}} pizza',
                slots: ['g1e83meg'],
              },
              {
                text: 'I want a {{[type].l5e23muh}} pizza',
                slots: ['l5e23muh'],
              },
              {
                text: 'I want pizza please',
                slots: [],
              },
              {
                text: 'give me pizza',
                slots: [],
              },
              {
                text: 'I want pizza',
                slots: [],
              },
              {
                text: 'pizza',
                slots: [],
              },
            ],
          },
          det83mbe: {
            id: 'det83mbe',
            name: 'yes',
            slots: {
              allKeys: [],
              byKey: {},
            },
            inputs: [
              {
                text: 'ya',
                slots: [],
              },
              {
                text: 'fine',
                slots: [],
              },
              {
                text: 'okay',
                slots: [],
              },
              {
                text: 'sure',
                slots: [],
              },
              {
                text: 'yes',
                slots: [],
              },
            ],
          },
          idua3mti: {
            id: 'idua3mti',
            name: 'no',
            slots: {
              allKeys: [],
              byKey: {},
            },
            inputs: [
              {
                text: 'no thank you',
                slots: [],
              },
              {
                text: 'wrong',
                slots: [],
              },
              {
                text: 'negative',
                slots: [],
              },
              {
                text: 'incorrect',
                slots: [],
              },
              {
                text: 'nope',
                slots: [],
              },
              {
                text: 'no thanks',
                slots: [],
              },
              {
                text: 'no',
                slots: [],
              },
            ],
          },
        },
      },
      slot: {
        allKeys: ['l5e23muh', 'g1e83meg', '4ced3msr'],
        byKey: {
          l5e23muh: {
            id: 'l5e23muh',
            name: 'type',
            type: 'Custom',
            color: '#4F9ED1',
            inputs: [
              {
                id: '1vg63qz1',
                value: 'cheese',
                synonyms: 'cheese',
              },
              {
                id: '1vg73q8f',
                value: 'pepperoni',
                synonyms: '',
              },
            ],
          },
          g1e83meg: {
            id: 'g1e83meg',
            name: 'size',
            type: 'Custom',
            color: '#A086C4',
            inputs: [
              {
                id: '1vg83qpk',
                value: 'small',
                synonyms: '',
              },
              {
                id: '1vg93qtx',
                value: 'medium',
                synonyms: '',
              },
              {
                id: '1vga3qn1',
                value: 'large',
                synonyms: '',
              },
              {
                id: '1vgb3qio',
                value: 'extra large',
                synonyms: '',
              },
            ],
          },
          '4ced3msr': {
            id: '4ced3msr',
            name: 'method',
            type: 'Custom',
            color: '#BF395B',
            inputs: [
              {
                id: '1vgc3qn8',
                value: 'pickup',
                synonyms: 'pick up, take away, takeaway',
              },
              {
                id: '1vgd3qls',
                value: 'delivery',
                synonyms: '',
              },
            ],
          },
        },
      },
      variableSet: {
        umzQgfv9WKOv5ReRB1nfZbm8cj6jq9fC: [],
        ExkS1H5GKJg7PeZPeO0rOiCVql3NCCL4: [],
        dxbhjuUEEpEyodBbdUBVt5aV0ysrlzZq: ['new'],
        B70Fb1TZQYgZ6EZqGfRjr3mrkD5lJAaH: ['aaaa', 'bbb'],
      },
    }),
    withModalContext(ModalType.INTERACTION_MODEL),
    (Component: React.FC) => (
      <OverlayProvider>
        <ToastContainer />
        <Component />
      </OverlayProvider>
    )
  );

export default {
  title: 'Creator/Interaction Model Modal',
  component: InteractionModelModal,
  includeStories: [],
};

export const base = createStory()(() => <InteractionModelModal />);
