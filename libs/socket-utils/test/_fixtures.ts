import { Utils } from '@voiceflow/common';

const generateEmail = () => `${Utils.generate.id(true)}@example.com`;
const generateURL = () => `https://s3.amazonaws.com/com.example.images/${Utils.generate.id()}.png`;

export const mockAxiosError = (status: number) => Object.assign(new Error(), { isAxiosError: true, response: { status } });

export const MOCK_ACTION = {
  type: 'workspace.CRUD:REPLACE',
  payload: {
    values: Utils.generate.array(10, () => ({
      id: Utils.generate.id(true),
      name: `Demo Workspace - ${Utils.generate.string()}`,
      projectLists: [
        {
          name: 'First Demo List',
          board_id: Utils.generate.id(),
          projects: Utils.generate.array(140, Utils.generate.id),
        },
        {
          name: 'Second Demo List',
          board_id: Utils.generate.id(),
          projects: Utils.generate.array(12, Utils.generate.id),
        },
        {
          name: 'Third Demo List',
          board_id: Utils.generate.id(),
          projects: Utils.generate.array(25, Utils.generate.id),
        },
        {
          name: 'Fourth Demo List',
          board_id: Utils.generate.id(),
          projects: Utils.generate.array(10, Utils.generate.id),
        },
        {
          name: 'Fifth Demo List',
          board_id: Utils.generate.id(),
          projects: Utils.generate.array(10, Utils.generate.id),
        },
        {
          name: 'Last Demo List',
          board_id: Utils.generate.id(),
          projects: [],
        },
      ],
      created: '2019-04-19T00:13:14.875Z',
      planSeatLimits: {
        editor: 100,
        viewer: 100,
      },
      creatorID: Utils.generate.number(),
      image: generateURL(),
      projects: 1000,
      seats: 1000,
      state: null,
      plan: 'pro',
      members: Utils.generate.array(10, () => ({
        creator_id: Utils.generate.number(),
        created: '1582640236',
        email: generateEmail(),
        image: generateURL(),
        name: Utils.generate.string(),
        role: 'editor',
      })),
      organizationID: '',
    })),
  },
};

export const MOCK_CONTEXT = {
  id: 233,
  time: 233,
  subprotocol: '1.0.0',
};
