import { Utils } from '@voiceflow/common';

import manager from './manager';
import { Props as ConfirmProps } from './modals/Confirm';
import { Props as ErrorProps } from './modals/Error';
import { Props as SuccessProps } from './modals/Success';

export const openError = (props: ErrorProps = {}) => manager.open('error', 'Error', { props }).catch(Utils.functional.noop);
export const closeError = () => manager.close('error', 'Error');

export const openSuccess = (props: SuccessProps) => manager.open('success', 'Success', { props }).catch(Utils.functional.noop);
export const closeSuccess = () => manager.open('success', 'Success');

export const openConfirm = (props: ConfirmProps) => manager.open('confirm', 'Confirm', { props }).catch(Utils.functional.noop);
export const closeConfirm = () => manager.close('confirm', 'Confirm');
