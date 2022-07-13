import React from 'react';

import { ConfirmProps } from '@/components/ConfirmModal';
import { Action, RootReducer } from '@/store/types';

import { createAction } from './utils';

interface ErrorModal {
  error?: React.ReactNode;
  message?: React.ReactNode;
  violations?: { message: React.ReactNode }[];
  [key: string]: unknown;
}

interface StandardModal {
  body?: React.ReactNode;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: number;
  withHeader?: boolean;
}

export interface ModalState {
  modal: StandardModal | null;
  errorModal: ErrorModal | null;
  confirmModal: ConfirmProps | null;
}

export const STATE_KEY = 'modal';

export const INITIAL_STATE: ModalState = {
  modal: null,
  errorModal: null,
  confirmModal: null,
};

export enum ModalAction {
  SET_ERROR = 'SET_ERROR',
  SET_MODAL = 'SET_MODAL',
  CLEAR_MODAL = 'CLEAR_MODAL',
  SET_CONFIRM = 'SET_CONFIRM',
  OPEN_CONFIRM = 'OPEN_CONFIRM',
}

// action types

export type SetConfirm = Action<ModalAction.SET_CONFIRM, ConfirmProps>;

export type SetError = Action<ModalAction.SET_ERROR, ErrorModal>;

export type SetModal = Action<ModalAction.SET_MODAL, StandardModal>;

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

export const setConfirm = (confirm: ConfirmProps): SetConfirm => createAction(ModalAction.SET_CONFIRM, confirm);

export const setError = (rawError: string | { message?: unknown; data?: unknown; [key: string]: unknown }): SetError => {
  let error = rawError;

  if (typeof error === 'string') {
    error = { message: error };
  }
  if (!error.message && error.data) {
    error = { ...error, message: error.data };
  }

  return createAction(ModalAction.SET_ERROR, error as ErrorModal);
};

export const setGenericError = () => setError('Something went wrong - please refresh your page');

export const setModal = (modal: StandardModal): SetModal => createAction(ModalAction.SET_MODAL, modal);

export const clearModal = (): ClearModal => createAction(ModalAction.CLEAR_MODAL);
