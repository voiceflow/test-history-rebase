import type { PaymentProps } from '../modals/Payment';
import type { UpgradeModal } from '../modals/Upgrade';
import { useModal } from './modal';

// needs this to fix circular deps issue
export const useUpgradeModal = () => useModal<UpgradeModal>('Upgrade');
export const usePaymentModal = () => useModal<PaymentProps>('Payment');
