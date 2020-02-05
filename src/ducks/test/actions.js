import { createAction } from '@/ducks/utils';

// actions

export const UPDATE_TEST = 'TEST:UPDATE';
export const UPDATE_TEST_STATE = 'TEST:STATE:UPDATE';
export const UPDATE_TEST_TIME = 'TEST:TIME:UPDATE';
export const UPDATE_TEST_MODE = 'TEST:UPDATE_TEST_MODE';
export const UPDATE_DIALOG = 'TEST:DIALOG:UPDATE';

// action creators

export const updateTest = (payload) => createAction(UPDATE_TEST, payload);

export const updateDialog = (payload) => createAction(UPDATE_DIALOG, payload);

export const updateInTest = () => createAction(UPDATE_TEST_MODE);

export const resetTime = () => createAction(UPDATE_TEST_TIME, 0);
