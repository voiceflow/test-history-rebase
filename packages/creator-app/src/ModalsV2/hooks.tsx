import { AnyRecord, EmptyObject, Utils } from '@voiceflow/common';
import { useCreateConst } from '@voiceflow/ui';
import React from 'react';

import { Context } from './context';
import manager from './manager';
import * as T from './types';

export function useModal<Props extends EmptyObject>(component: T.RegisteredModal<Props & T.VoidInternalProps>, id?: string): T.PropsPublicAPI<Props>;
export function useModal<Props extends void, Result>(
  component: T.RegisteredModal<Props & T.ResultInternalProps<Result>>,
  id?: string
): T.ResultPublicAPI<Props, Result>;
export function useModal<Props extends EmptyObject, Result>(
  component: T.RegisteredModal<Props & T.ResultInternalProps<Result>>,
  id?: string
): T.PropsResultPublicAPI<Props, Result>;
export function useModal(component: T.RegisteredModal<T.VoidInternalProps>, id?: string): T.VoidPublicAPI;
export function useModal<Props extends EmptyObject>(type: string, id?: string): T.PropsPublicAPI<Props>;
export function useModal<Props extends void, Result>(type: string, id?: string): T.ResultPublicAPI<Props, Result>;
export function useModal<Props extends EmptyObject, Result>(type: string, id?: string): T.PropsResultPublicAPI<Props, Result>;
export function useModal(type: string, id?: string): T.VoidPublicAPI;
export function useModal(
  registeredModal: string | T.RegisteredModal<T.VoidInternalProps> | T.RegisteredModal<AnyRecord & T.ResultInternalProps<any>>,
  id?: string
): T.PropsPublicAPI<any> | T.ResultPublicAPI<any, any> | T.PropsResultPublicAPI<any, any> | T.VoidPublicAPI {
  const modals = React.useContext(Context);

  const type = typeof registeredModal === 'string' ? registeredModal : registeredModal.__vfModalType;
  const modalID = useCreateConst(() => id || Utils.id.cuid.slug());
  const combinedID = useCreateConst(() => manager.getCombinedID(modalID, type));

  const open = React.useCallback((data: AnyRecord = {}) => manager.open(modalID, type, data), []);
  const close = React.useCallback(() => manager.close(modalID, type), []);
  const openVoid = React.useCallback((data: AnyRecord = {}) => open(data).catch(() => null), []);
  const updateData = React.useCallback((data: AnyRecord = {}) => manager.update(modalID, type, data), []);
  const enableClose = React.useCallback(() => manager.enableClose(modalID, type), []);
  const preventClose = React.useCallback(() => manager.preventClose(modalID, type), []);

  const rendered = React.useMemo(() => modals.state.allKeys.includes(combinedID), [modals.state.allKeys]);

  const modal = modals.state.byKey[combinedID];

  return {
    id: modalID,
    type,
    open,
    close,
    opened: rendered && !modal?.closing,
    hidden: modals.state.allKeys[0] !== combinedID,
    animated: modals.animated,
    rendered,
    openVoid,
    updateData,
    enableClose,
    preventClose,
    closePrevented: !!modal?.closePrevented,
  };
}
