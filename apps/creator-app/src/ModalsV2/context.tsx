import type { AnyRecord } from '@voiceflow/common';
import { Utils } from '@voiceflow/common';
import { useCachedValue } from '@voiceflow/ui-next';
import * as Normal from 'normal-store';
import React, { useMemo } from 'react';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import type { AddRemoveCloseRequestHandlerEvent, CloseRemoveEvent, OpenEvent, UpdateEvent } from './manager';
import manager, { Event } from './manager';
import type * as T from './types';

interface Modal {
  id: string;
  key: string;
  api: T.VoidInternalAPI<any> | T.ResultInternalAPI<any, any>;
  type: string;
  props: AnyRecord;
  closing: boolean;
  reopened: boolean;
  closePrevented: boolean;
  closeRequestHandlers: Array<(source: T.CloseSource) => boolean>;
}

interface UpdateData {
  props?: AnyRecord;
  reopen?: boolean;
  closePrevented?: boolean;
}

interface ContextValue {
  state: Normal.Normalized<Modal>;
  animated: boolean;

  open: (
    id: string,
    type: string,
    props: AnyRecord,
    api: T.VoidInternalAPI<any> | T.ResultInternalAPI<any, any>
  ) => void;
  close: (id: string, type: string, source: T.CloseSource) => void;
  update: (id: string, type: string, props: UpdateData) => void;
  remove: (id: string, type: string) => void;
  enableClose: (id: string, type: string) => void;
  preventClose: (id: string, type: string) => void;
}

const initialState = Normal.createEmpty<Modal>();

export const Context = React.createContext<ContextValue>({
  state: initialState,
  animated: false,

  open: Utils.functional.noop,
  close: Utils.functional.noop,
  remove: Utils.functional.noop,
  update: Utils.functional.noop,
  enableClose: Utils.functional.noop,
  preventClose: Utils.functional.noop,
});

const reducer = reducerWithInitialState(initialState);

const actions = {
  open: Utils.protocol.createAction<Modal>('vf-modals/open'),
  clone: Utils.protocol.createAction('vf-modals/clone'),
  close: Utils.protocol.createAction<{ id: string; type: string }>('vf-modals/close'),
  remove: Utils.protocol.createAction<{ id: string; type: string }>('vf-modals/remove'),
  update: Utils.protocol.createAction<{ id: string; type: string; update: UpdateData }>('vf-modals/update'),
  addCloseRequestHandler: Utils.protocol.createAction<{
    id: string;
    type: string;
    handler: (source: T.CloseSource) => boolean;
  }>('vf-modals/add-close-request-handler'),
  removeCloseRequestHandler: Utils.protocol.createAction<{
    id: string;
    type: string;
    handler: (source: T.CloseSource) => boolean;
  }>('vf-modals/remove-close-request-handler'),
};

reducer
  .case(actions.open, (state, payload) =>
    Normal.prependOne(state, manager.getCombinedID(payload.id, payload.type), payload)
  )
  .case(actions.close, (state, payload) => {
    const modal = Normal.getOne(state, manager.getCombinedID(payload.id, payload.type));

    if (modal?.closePrevented) return state;

    return Normal.patchOne(state, manager.getCombinedID(payload.id, payload.type), { closing: true });
  })
  .case(actions.clone, (state) => ({ ...state }))
  .case(actions.remove, (state, payload) => Normal.removeOne(state, manager.getCombinedID(payload.id, payload.type)))
  .case(actions.update, (state, payload) =>
    Normal.patchOne(state, manager.getCombinedID(payload.id, payload.type), {
      ...Utils.object.omit(payload.update, ['reopen']),
      ...(payload.update.reopen ? { key: Utils.id.cuid.slug(), reopened: true } : {}),
    })
  )
  .case(actions.addCloseRequestHandler, (state, payload) =>
    Normal.patchOne(state, manager.getCombinedID(payload.id, payload.type), {
      closeRequestHandlers: [
        ...(Normal.getOne(state, manager.getCombinedID(payload.id, payload.type))?.closeRequestHandlers ?? []),
        payload.handler,
      ],
    })
  )
  .case(actions.removeCloseRequestHandler, (state, payload) =>
    Normal.patchOne(state, manager.getCombinedID(payload.id, payload.type), {
      closeRequestHandlers: (
        Normal.getOne(state, manager.getCombinedID(payload.id, payload.type))?.closeRequestHandlers ?? []
      ).filter((handler) => handler !== payload.handler),
    })
  );

export const Provider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const cache = useCachedValue(state);
  const prevAllKeysLengthRef = React.useRef(state.allKeys.length);

  const open = React.useCallback(
    (
      id: string,
      type: string,
      props: AnyRecord,
      api: T.VoidInternalAPI<any> | T.ResultInternalAPI<any, any>,
      options: T.OpenOptions = {}
    ) =>
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
          closeRequestHandlers: [],
        })
      ),
    []
  );
  const close = React.useCallback((id: string, type: string, source: T.CloseSource) => {
    const modal = Normal.getOne(cache.current, manager.getCombinedID(id, type));

    if (modal?.closeRequestHandlers.some((handler) => handler(source) === false)) return;

    dispatch(actions.close({ id, type }));
  }, []);
  const remove = React.useCallback((id: string, type: string) => dispatch(actions.remove({ id, type })), []);
  const update = React.useCallback(
    (id: string, type: string, update: UpdateData) => dispatch(actions.update({ id, type, update })),
    []
  );
  const enableClose = React.useCallback(
    (id: string, type: string) => dispatch(actions.update({ id, type, update: { closePrevented: false } })),
    []
  );
  const preventClose = React.useCallback(
    (id: string, type: string) => dispatch(actions.update({ id, type, update: { closePrevented: true } })),
    []
  );

  React.useEffect(() => {
    prevAllKeysLengthRef.current = state.allKeys.length;
  }, [state.allKeys.length]);

  React.useEffect(() => {
    const onOpen = ({ id, type, props, api, options }: OpenEvent) => open(id, type, props, api, options);
    const onClose = ({ id, type, source }: CloseRemoveEvent) => close(id, type, source);
    const onRemove = ({ id, type }: CloseRemoveEvent) => remove(id, type);
    const onUpdate = ({ id, type, payload }: UpdateEvent) => update(id, type, payload);
    const onReload = () => dispatch(actions.clone());
    const onAddCloseRequestHandler = ({ id, type, payload }: AddRemoveCloseRequestHandlerEvent) =>
      dispatch(actions.addCloseRequestHandler({ id, type, handler: payload }));
    const onRemoveCloseRequestHandler = ({ id, type, payload }: AddRemoveCloseRequestHandlerEvent) =>
      dispatch(actions.removeCloseRequestHandler({ id, type, handler: payload }));

    manager.on(Event.OPEN, onOpen);
    manager.on(Event.CLOSE, onClose);
    manager.on(Event.UPDATE, onUpdate);
    manager.on(Event.REMOVE, onRemove);
    manager.on(Event.RELOAD, onReload);
    manager.on(Event.ADD_CLOSE_REQUEST_HANDLER, onAddCloseRequestHandler);
    manager.on(Event.REMOVE_CLOSE_REQUEST_HANDLER, onRemoveCloseRequestHandler);

    return () => {
      manager.off(Event.OPEN, onOpen);
      manager.off(Event.CLOSE, onClose);
      manager.off(Event.UPDATE, onUpdate);
      manager.off(Event.REMOVE, onRemove);
      manager.off(Event.RELOAD, onReload);
      manager.off(Event.ADD_CLOSE_REQUEST_HANDLER, onAddCloseRequestHandler);
      manager.off(Event.REMOVE_CLOSE_REQUEST_HANDLER, onRemoveCloseRequestHandler);
    };
  }, []);

  const animated = state.allKeys.length <= 1 && prevAllKeysLengthRef.current <= 1;

  const api = useMemo(
    () => ({ open, close, state, update, remove, animated, enableClose, preventClose }),
    [state, animated]
  );

  return <Context.Provider value={api}>{children}</Context.Provider>;
};
