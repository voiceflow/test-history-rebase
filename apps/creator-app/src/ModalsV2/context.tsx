import { AnyRecord, Utils } from '@voiceflow/common';
import { useContextApi } from '@voiceflow/ui';
import * as Normal from 'normal-store';
import React from 'react';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import manager, { CloseRemoveEvent, Event, OpenEvent, UpdateEvent } from './manager';
import * as T from './types';

interface Modal {
  id: string;
  key: string;
  api: T.VoidInternalAPI | T.ResultInternalAPI<any>;
  type: string;
  props: AnyRecord;
  closing: boolean;
  reopened: boolean;
  closePrevented: boolean;
}

interface UpdateData {
  props?: AnyRecord;
  closePrevented?: boolean;
}

interface ContextValue {
  state: Normal.Normalized<Modal>;
  animated: boolean;

  open: (id: string, type: string, props: AnyRecord, api: T.VoidInternalAPI | T.ResultInternalAPI<any>) => void;
  close: (id: string, type: string) => void;
  update: (id: string, type: string, props: UpdateData) => void;
  remove: (id: string, type: string) => void;
  isClosing: (id: string, type: string) => boolean;
  enableClose: (id: string, type: string) => void;
  preventClose: (id: string, type: string) => void;
  isClosePrevented: (id: string, type: string) => boolean;
}

const initialState = Normal.createEmpty<Modal>();

export const Context = React.createContext<ContextValue>({
  state: initialState,
  animated: false,

  open: Utils.functional.noop,
  close: Utils.functional.noop,
  remove: Utils.functional.noop,
  update: Utils.functional.noop,
  isClosing: () => false,
  enableClose: Utils.functional.noop,
  preventClose: Utils.functional.noop,
  isClosePrevented: () => false,
});

const reducer = reducerWithInitialState(initialState);

const actions = {
  open: Utils.protocol.createAction<Modal>('vf-modals/open'),
  clone: Utils.protocol.createAction('vf-modals/clone'),
  close: Utils.protocol.createAction<{ id: string; type: string }>('vf-modals/close'),
  remove: Utils.protocol.createAction<{ id: string; type: string }>('vf-modals/remove'),
  update: Utils.protocol.createAction<{ id: string; type: string; update: UpdateData }>('vf-modals/update'),
};

reducer
  .case(actions.open, (state, payload) => Normal.prependOne(state, manager.getCombinedID(payload.id, payload.type), payload))
  .case(actions.close, (state, payload) => {
    const modal = Normal.getOne(state, manager.getCombinedID(payload.id, payload.type));

    if (modal?.closePrevented) return state;

    return Normal.patchOne(state, manager.getCombinedID(payload.id, payload.type), { closing: true });
  })
  .case(actions.clone, (state) => ({ ...state }))
  .case(actions.remove, (state, payload) => Normal.removeOne(state, manager.getCombinedID(payload.id, payload.type)))
  .case(actions.update, (state, payload) => Normal.patchOne(state, manager.getCombinedID(payload.id, payload.type), payload.update));

export const Provider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const prevAllKeysLengthRef = React.useRef(state.allKeys.length);

  const open = React.useCallback(
    (id: string, type: string, props: AnyRecord, api: T.VoidInternalAPI | T.ResultInternalAPI<any>, options: T.OpenOptions = {}) =>
      dispatch(
        actions.open({
          id,
          key: Utils.id.cuid.slug(),
          api,
          type,
          props,
          closing: false,
          reopened: options.reopen ?? false,
          closePrevented: false,
        })
      ),
    []
  );
  const close = React.useCallback((id: string, type: string) => dispatch(actions.close({ id, type })), []);
  const remove = React.useCallback((id: string, type: string) => dispatch(actions.remove({ id, type })), []);
  const update = React.useCallback((id: string, type: string, update: UpdateData) => dispatch(actions.update({ id, type, update })), []);
  const isClosing = React.useCallback((id: string, type: string) => !!Normal.getOne(state, manager.getCombinedID(id, type))?.closing, [state]);
  const enableClose = React.useCallback((id: string, type: string) => dispatch(actions.update({ id, type, update: { closePrevented: false } })), []);
  const preventClose = React.useCallback((id: string, type: string) => dispatch(actions.update({ id, type, update: { closePrevented: true } })), []);
  const isClosePrevented = React.useCallback(
    (id: string, type: string) => !!Normal.getOne(state, manager.getCombinedID(id, type))?.closePrevented,
    [state]
  );

  React.useEffect(() => {
    prevAllKeysLengthRef.current = state.allKeys.length;
  }, [state.allKeys.length]);

  React.useEffect(() => {
    const onOpen = ({ id, type, props, api, options }: OpenEvent) => open(id, type, props, api, options);
    const onClose = ({ id, type }: CloseRemoveEvent) => close(id, type);
    const onRemove = ({ id, type }: CloseRemoveEvent) => remove(id, type);
    const onUpdate = ({ id, type, payload }: UpdateEvent) => update(id, type, payload);
    const onReload = () => dispatch(actions.clone());

    manager.on(Event.OPEN, onOpen);
    manager.on(Event.CLOSE, onClose);
    manager.on(Event.UPDATE, onUpdate);
    manager.on(Event.REMOVE, onRemove);
    manager.on(Event.RELOAD, onReload);

    return () => {
      manager.off(Event.OPEN, onOpen);
      manager.off(Event.CLOSE, onClose);
      manager.off(Event.UPDATE, onUpdate);
      manager.off(Event.REMOVE, onRemove);
      manager.off(Event.RELOAD, onReload);
    };
  }, []);

  const api = useContextApi({
    open,
    close,
    state,
    update,
    remove,
    animated: state.allKeys.length <= 1 && prevAllKeysLengthRef.current <= 1,
    isClosing,
    enableClose,
    preventClose,
    isClosePrevented,
  });

  return <Context.Provider value={api}>{children}</Context.Provider>;
};
