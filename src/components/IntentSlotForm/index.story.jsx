import React from 'react';

import { composeDecorators, withRedux } from '@/../.storybook';

import IntentSlotForm from '.';

const NODE_ID = 1;

const withDecorators = composeDecorators(
  withRedux({
    creator: {
      focus: {
        target: NODE_ID,
        isActive: true,
      },
      diagram: {
        past: [],
        present: {
          ports: {
            allKeys: [1],
            byKey: {
              1: {},
            },
          },
          data: {
            [NODE_ID]: {
              name: 'name',
              alexa: {
                intent: 'n2a3spx',
              },
            },
          },
          nodes: {
            allKeys: [NODE_ID],
            byKey: {
              [NODE_ID]: {
                id: [NODE_ID],
                ports: {
                  in: [],
                  out: [],
                },
              },
            },
          },
        },
        future: [],
      },
    },

    intent: {
      allKeys: ['n2a3spx', 'xoj3svw'],
      byKey: {
        n2a3spx: {
          id: 'n2a3spx',
          name: 'intent1',
          slots: {
            byKey: {
              at1k3sf8: {
                id: 'at1k3sf8',
                dialog: { prompt: '', utterances: [], confirm: '' },
                required: false,
              },
              ldl3s4m: {
                id: 'ldl3s4m',
                dialog: { prompt: '', utterances: [], confirm: '' },
                required: true,
              },
            },
            allKeys: ['at1k3sf8', 'ldl3s4m'],
          },
          inputs: [
            {
              slots: [],
              text: 'qwe',
            },
            {
              slots: ['at1k3sf8'],
              text: 'asd {{[aaa].at1k3sf8}}',
            },
            {
              slots: ['ldl3s4m'],
              text: 'asd {{[aaa].ldl3s4m}} asdasd {{[aaa].at1k3sf8}} asd as d ',
            },
          ],
          open: true,
        },
        xoj3svw: {
          id: 'xoj3svw',
          name: 'intent2',
          slots: {
            byKey: {},
            allKeys: [],
          },
          inputs: [
            {
              slots: [],
              text: 'some utterance text',
            },
          ],
          open: false,
        },
      },
    },

    slot: {
      allKeys: ['ldl3s4m', 'at1k3sf8'],
      byKey: {
        ldl3s4m: {
          id: 'ldl3s4m',
          name: 'asdasd',
          inputs: ['asdasdasd', 'asdasd', 'a', 'sd', 'asd', 'asdas', 'd'],
          open: true,
          selected: 'Custom',
        },
        at1k3sf8: {
          id: 'at1k3sf8',
          name: 'aaa',
          inputs: ['asdasd', 'sdfsdfsdf'],
          open: true,
          selected: 'Airport',
        },
      },
    },
  }),
  (Component) => (
    <div style={{ width: '480px', maxHeight: '400px', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
      <Component />
    </div>
  )
);

export default {
  title: 'Creator/Editors/Intent/Slot Editor',
  component: IntentSlotForm,
  includeStories: [],
};

export const normal = withDecorators(() => <IntentSlotForm activePath={{ id: 'ldl3s4m', intentID: 'n2a3spx' }} />);
