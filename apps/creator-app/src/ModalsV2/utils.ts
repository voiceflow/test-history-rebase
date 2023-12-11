import { Utils } from '@voiceflow/common';

import manager from './manager';
import { Props as ConfirmProps } from './modals/Confirm';
import { Props as ErrorProps } from './modals/Error';
import { Props as SuccessProps } from './modals/Success';

export const openError = (props: ErrorProps = {}) => manager.open('error', 'Error', { props }).catch(Utils.functional.noop);
export const closeError = () => manager.close('error', 'Error', 'api');

export const openSuccess = (props: SuccessProps) => manager.open('success', 'Success', { props }).catch(Utils.functional.noop);
export const closeSuccess = () => manager.close('success', 'Success', 'api');

export const openConfirm = (props: ConfirmProps) => manager.open('confirm', 'Confirm', { props }).catch(Utils.functional.noop);
export const closeConfirm = () => manager.close('confirm', 'Confirm', 'api');

export const open = manager.open.bind(manager) as typeof manager.open;
export const close = manager.close.bind(manager) as typeof manager.close;
export const update = manager.update.bind(manager) as typeof manager.update;
export const create = manager.create.bind(manager) as typeof manager.create;
export const register = manager.register.bind(manager) as typeof manager.register;
