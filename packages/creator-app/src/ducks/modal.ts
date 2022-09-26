import React from 'react';

import { ConfirmProps } from '@/components/ConfirmModal';
import { Action, RootReducer } from '@/store/types';

import { createAction } from './utils';

interface StandardModal {
  body?: React.ReactNode;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: number;
  withHeader?: boolean;
}

export interface ModalState {
  modal: StandardModal | null;
  confirmModal: ConfirmProps | null;
}

export const STATE_KEY = 'modal';

export const INITIAL_STATE: ModalState = {
  modal: null,
  confirmModal: null,
};

export enum ModalAction {
  SET_MODAL = 'SET_MODAL',
  CLEAR_MODAL = 'CLEAR_MODAL',
  SET_CONFIRM = 'SET_CONFIRM',
  OPEN_CONFIRM = 'OPEN_CONFIRM',
}

// action types

export type SetConfirm = Action<ModalAction.SET_CONFIRM, ConfirmProps>;

export type SetModal = Action<ModalAction.SET_MODAL, StandardModal>;

export type ClearModal = Action<ModalAction.CLEAR_MODAL>;

type AnyModalAction = SetConfirm | SetModal | ClearModal;

// reducers

const modalReducer: RootReducer<ModalState, AnyModalAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ModalAction.SET_CONFIRM:
      return {
        ...state,
        confirmModal: action.payload,
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

export const setModal = (modal: StandardModal): SetModal => createAction(ModalAction.SET_MODAL, modal);

export const clearModal = (): ClearModal => createAction(ModalAction.CLEAR_MODAL);
