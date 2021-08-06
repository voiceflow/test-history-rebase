import { Action, createAction, RootReducer } from '@voiceflow/ui';

export interface ModalState {
  confirmModal: { confirm: () => void; [key: string]: unknown } | null;
  errorModal: { message?: string | unknown; [key: string]: unknown } | null;
  modal: unknown | null;
}

export const STATE_KEY = 'modal';
export const INITIAL_STATE: ModalState = {
  confirmModal: null,
  errorModal: null,
  modal: null,
};

export enum ModalAction {
  SET_CONFIRM = 'SET_CONFIRM',
  SET_ERROR = 'SET_ERROR',
  SET_MODAL = 'SET_MODAL',
  CLEAR_MODAL = 'CLEAR_MODAL',
}

// action types

export type SetConfirm = Action<ModalAction.SET_CONFIRM, { confirm: () => void; [key: string]: unknown }>;

export type SetError = Action<ModalAction.SET_ERROR, { message?: string | unknown; [key: string]: unknown }>;

export type SetModal = Action<ModalAction.SET_MODAL, unknown>;

export type ClearModal = Action<ModalAction.CLEAR_MODAL>;

type AnyModalAction = SetConfirm | SetError | SetModal | ClearModal;

// reducers

const modalReducer: RootReducer<ModalState, AnyModalAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ModalAction.SET_CONFIRM:
      return {
        ...state,
        confirmModal: action.payload,
      };
    case ModalAction.SET_ERROR:
      return {
        ...state,
        errorModal: action.payload,
      };
    case ModalAction.SET_MODAL:
      return {
        ...state,
        modal: action.payload,
      };
    case ModalAction.CLEAR_MODAL:
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default modalReducer;

// action creators

export const setConfirm = (confirm: { params?: any[]; confirm?: (...args: any[]) => void; [key: string]: unknown }): SetConfirm =>
  createAction(ModalAction.SET_CONFIRM, {
    ...confirm,
    confirm: () => {
      if (typeof confirm.confirm !== 'function') return;

      if (confirm.params) {
        confirm.confirm(...confirm.params);
      } else {
        confirm.confirm();
      }
    },
  });

export const setError = (rawError: string | { message?: unknown; data?: unknown; [key: string]: unknown }): SetError => {
  let error = rawError;

  if (typeof error === 'string') {
    error = { message: error };
  }
  if (!error.message && error.data) {
    error = { ...error, message: error.data };
  }

  return createAction(ModalAction.SET_ERROR, error);
};

export const setGenericError = () => setError('Something went wrong - please refresh your page');

export const setModal = (def: unknown): SetModal => createAction(ModalAction.SET_MODAL, def);

export const clearModal = (): ClearModal => createAction(ModalAction.CLEAR_MODAL);
