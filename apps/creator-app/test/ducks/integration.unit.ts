import { Utils } from '@voiceflow/common';
import axios, { AxiosError } from 'axios';

import * as Integration from '@/ducks/integration';

import suite from './_suite';

const INTEGRATION_USER: any = Utils.generate.object();
const MOCK_STATE: Integration.IntegrationState = {
  integration_users: {
    abc: [INTEGRATION_USER],
  },
  loading: true,
  error: 'this is an error',
};

suite(Integration, MOCK_STATE)('Ducks - Integration', ({ describeReducer, describeSelectors, describeSideEffects }) => {
  describeReducer(({ expectAction }) => {
    describe('fetchIntegrationUsersBegin()', () => {
      it('should start fetching users', () => {
        expectAction(Integration.fetchIntegrationUsersBegin()).withState({ loading: false, error: 'some error' }).toModify({
          loading: true,
          error: null,
        });
      });
    });

    describe('fetchIntegrationUsersFailure()', () => {
      it('should catch error fetching users', () => {
        const error = new Error('fail');

        expectAction(Integration.fetchIntegrationUsersFailure(error)).toModify({
          error,
          loading: false,
          integration_users: {},
        });
      });
    });

    describe('fetchIntegrationUsersSuccess()', () => {
      it('should succeed fetching users', () => {
        const integrationUsers: any = Utils.generate.object();

        expectAction(Integration.fetchIntegrationUsersSuccess(integrationUsers)).toModify({
          loading: false,
          integration_users: integrationUsers,
        });
      });
    });

    describe('addIntegrationUserBegin()', () => {
      it('should start adding user', () => {
        expectAction(Integration.addIntegrationUserBegin()).withState({ loading: false, error: 'some error' }).toModify({
          loading: true,
          error: null,
        });
      });
    });

    describe('addIntegrationUserFailure()', () => {
      it('should catch error adding user', () => {
        const error = 'fail';

        expectAction(Integration.addIntegrationUserFailure(error)).toModify({
          error,
          loading: false,
        });
      });
    });

    describe('addIntegrationUserSuccess()', () => {
      it('should succeed adding user', () => {
        const integrationUsers: any = Utils.generate.object();

        expectAction(Integration.addIntegrationUserSuccess(integrationUsers)).toModify({
          loading: false,
          integration_users: integrationUsers,
        });
      });
    });

    describe('deleteIntegrationUserBegin()', () => {
      it('should start deleting user', () => {
        expectAction(Integration.deleteIntegrationUserBegin()).withState({ loading: false, error: 'some error' }).toModify({
          loading: true,
          error: null,
        });
      });
    });

    describe('deleteIntegrationUserFailure()', () => {
      it('should catch error deleting user', () => {
        const error = new Error('fail');

        expectAction(Integration.deleteIntegrationUserFailure(error)).toModify({
          error,
          loading: false,
        });
      });
    });

    describe('deleteIntegrationUserSuccess()', () => {
      it('should succeed deleting user', () => {
        const integrationUsers: any = Utils.generate.object();

        expectAction(Integration.deleteIntegrationUserSuccess(integrationUsers)).toModify({
          loading: false,
          integration_users: integrationUsers,
        });
      });
    });
  });

  describeSelectors(({ select }) => {
    describe('integrationUsersSelector()', () => {
      it('should select users', () => {
        expect(select(Integration.integrationUsersSelector)).toBe(MOCK_STATE.integration_users);
      });
    });

    describe('integrationUsersLoadingSelector()', () => {
      it('should select whether users are loading', () => {
        expect(select(Integration.integrationUsersLoadingSelector)).toBeTruthy();
      });
    });

    describe('integrationUsersErrorSelector()', () => {
      it('should select an active error', () => {
        expect(select(Integration.integrationUsersErrorSelector)).toBe(MOCK_STATE.error);
      });
    });
  });

  describeSideEffects(({ applyEffect, catchEffect }) => {
    const platform = Utils.generate.string();
    const platformUsers = Utils.generate.array(3, () => ({ platform }));
    const platform2 = Utils.generate.string();
    const platformUsers2 = Utils.generate.array(2, () => ({ platform: platform2 }));
    const users = [...platformUsers, ...platformUsers2];

    describe('fetchIntegrationUsers()', () => {
      it('should fetch users', async () => {
        const axiosPost = vi.spyOn(axios, 'post').mockResolvedValue({ data: users } as any);

        const { expectDispatch } = await applyEffect(Integration.fetchIntegrationUsers());

        expect(axiosPost).toBeCalledWith('/integrations/get_users');
        expectDispatch(Integration.fetchIntegrationUsersBegin());
        expectDispatch(
          Integration.fetchIntegrationUsersSuccess({
            [platform]: platformUsers,
            [platform2]: platformUsers2,
          })
        );
      });

      it('should catch errors', async () => {
        const mockError = new Error('fail');
        vi.spyOn(axios, 'post').mockRejectedValue(mockError);

        const { expectDispatch, error } = await catchEffect(Integration.fetchIntegrationUsers());

        expectDispatch(Integration.fetchIntegrationUsersBegin());
        expectDispatch(Integration.fetchIntegrationUsersFailure(mockError));
        expect(error).toBe(mockError);
      });
    });

    describe('addIntegrationUser()', () => {
      const integration = Utils.generate.string();
      const userData: any = Utils.generate.object();

      it('should fetch users', async () => {
        const axiosPost = vi.spyOn(axios, 'post').mockResolvedValue({ data: users } as any);

        const { expectDispatch } = await applyEffect(Integration.addIntegrationUser(integration, userData));

        expect(axiosPost).toBeCalledWith('/integrations/add_user', { integration, ...userData });
        expectDispatch(Integration.addIntegrationUserBegin());
        expectDispatch(
          Integration.addIntegrationUserSuccess({
            [platform]: platformUsers,
            [platform2]: platformUsers2,
          })
        );
      });

      it('should catch error with response.data string', async () => {
        const errorMessage = Utils.generate.string();
        const mockError: any = new AxiosError(undefined, undefined, undefined, undefined, { data: errorMessage } as any);
        vi.spyOn(axios, 'post').mockRejectedValue(mockError);

        const { expectDispatch, error } = await catchEffect(Integration.addIntegrationUser(integration, userData));

        expectDispatch(Integration.addIntegrationUserBegin());
        expectDispatch(Integration.addIntegrationUserFailure(errorMessage));
        expect(error).toBe(errorMessage);
      });

      it('should catch error with response.data object', async () => {
        const mockError: any = new AxiosError(undefined, undefined, undefined, undefined, { data: { message: 'uh oh!' } } as any);

        vi.spyOn(axios, 'post').mockRejectedValue(mockError);

        const { expectDispatch, error } = await catchEffect(Integration.addIntegrationUser(integration, userData));

        expectDispatch(Integration.addIntegrationUserBegin());
        expectDispatch(Integration.addIntegrationUserFailure('uh oh!'));
        expect(error).toBe('uh oh!');
      });

      it('should catch string error', async () => {
        const errorMessage = Utils.generate.string();
        vi.spyOn(axios, 'post').mockRejectedValue(errorMessage);

        const { expectDispatch, error } = await catchEffect(Integration.addIntegrationUser(integration, userData));

        expectDispatch(Integration.addIntegrationUserBegin());
        // expectDispatch(Integration.addIntegrationUserFailure(errorMessage));
        expect(error).toBe(errorMessage);
      });
    });

    describe('deleteIntegrationUser()', () => {
      const integration = Utils.generate.string();
      const userData: any = Utils.generate.object();

      it('should fetch users', async () => {
        const axiosPost = vi.spyOn(axios, 'post').mockResolvedValue({ data: users } as any);

        const { expectDispatch } = await applyEffect(Integration.deleteIntegrationUser(integration, userData));

        expect(axiosPost).toBeCalledWith('/integrations/delete_user', { integration, ...userData });
        expectDispatch(Integration.deleteIntegrationUserBegin());
        expectDispatch(
          Integration.deleteIntegrationUserSuccess({
            [platform]: platformUsers,
            [platform2]: platformUsers2,
          })
        );
      });

      it('should catch errors', async () => {
        const mockError = new Error('fail');
        vi.spyOn(axios, 'post').mockRejectedValue(mockError);

        const { expectDispatch, error } = await catchEffect(Integration.deleteIntegrationUser(integration, userData));

        expectDispatch(Integration.deleteIntegrationUserBegin());
        expectDispatch(Integration.deleteIntegrationUserFailure(mockError));
        expect(error).toBe(mockError);
      });
    });
  });
});
