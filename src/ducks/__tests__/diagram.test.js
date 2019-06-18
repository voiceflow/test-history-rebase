import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as actions from '../diagram';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const store = mockStore();

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    get: () =>
      new Promise((resolve, reject) => {
        const e = new Error('No Net');
        e.response = 'No Net';
        reject(e);
      }),
  },
}));

describe('Diagram Actions Test', () => {
  beforeEach(() => {
    store.clearActions();
  });
  test('dispatches fetch diagram (failure)', async () => {
    console.error = jest.fn();

    const expectedAction = [
      {
        type: 'FETCH_DIAGRAMS_BEGIN',
      },
      {
        type: 'FETCH_DIAGRAMS_FAILURE',
        payload: {
          error: 'Could Not Retrieve Project Diagrams',
        },
      },
    ];
    await store.dispatch(actions.fetchDiagrams(1));
    expect(store.getActions()).toEqual(expectedAction);
    expect(console.error.mock.calls[0][0]).toEqual('No Net');
  });
});
