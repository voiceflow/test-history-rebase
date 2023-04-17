import type { Props as ConfirmProps } from '../modals/Confirm';
import type { Props as ErrorProps } from '../modals/Error';
import type { PaymentModalProps } from '../modals/Payment';
import type { Props as SuccessProps } from '../modals/Success';
import type { UpgradeModal } from '../modals/Upgrade';
import type { CreateVariableStateModalProps } from '../modals/VariableStates/Create';
import { useModal } from './modal';

// needs these to fix circular deps issue
export const useErrorModal = () => useModal<ErrorProps>('Error');
export const useSuccessModal = () => useModal<SuccessProps>('Success');
export const useConfirmModal = () => useModal<ConfirmProps>('Confirm');
export const useUpgradeModal = () => useModal<UpgradeModal>('Upgrade');
export const usePaymentModal = () => useModal<PaymentModalProps>('Payment');
export const useCreateVariableStateModal = () => useModal<CreateVariableStateModalProps>('VariableStateCreate');
