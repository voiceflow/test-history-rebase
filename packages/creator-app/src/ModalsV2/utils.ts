import manager from './manager';
import { Props as ErrorProps } from './modals/Error';
import { Props as SuccessProps } from './modals/Success';

export const openSuccess = (props: SuccessProps) => manager.open('success', 'Success', { props });

export const openError = (props: ErrorProps = {}) => manager.open('error', 'Error', { props });
