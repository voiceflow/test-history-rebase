import type { Props as ConfirmProps } from '../modals/Confirm';
import type { Props as ErrorProps } from '../modals/Error';
import type { Result as SlotsBulkImportResult } from '../modals/NLU/BulkImport/Slots';
import type { Props as BulkImportUtterancesProps, Result as BulkImportUtterancesResult } from '../modals/NLU/BulkImport/Utterances';
import type { NLUIntentCreateProps, NLUIntentCreateResult } from '../modals/NLU/Intent/Create';
import type { NLUIntentEditProps } from '../modals/NLU/Intent/Edit';
import type { NLUVariableCreateProps } from '../modals/NLU/Variable/Create';
import type { PaymentModalProps } from '../modals/Payment';
import type { Props as SuccessProps } from '../modals/Success';
import type { UpgradeModal } from '../modals/Upgrade';
import type { Props as VariablePromptProps, Result as VariablePromptResult } from '../modals/VariablePrompt';
import type { CreateVariableStateModalProps } from '../modals/VariableStates/Create';
import { useModal } from './modal';

// needs these to fix circular deps issue
export const useErrorModal = () => useModal<ErrorProps>('Error');
export const useSuccessModal = () => useModal<SuccessProps>('Success');
export const useConfirmModal = () => useModal<ConfirmProps>('Confirm');
export const useUpgradeModal = () => useModal<UpgradeModal>('Upgrade');
export const useAddSeatsModal = () => useModal('AddSeats');
export const usePaymentModal = () => useModal<PaymentModalProps>('Payment');
export const useEditIntentModal = () => useModal<NLUIntentEditProps>('NLUIntentEdit');
export const useCreateIntentModal = () => useModal<NLUIntentCreateProps, NLUIntentCreateResult>('NLUIntentCreate');
export const useCreateVariableModal = () => useModal<NLUVariableCreateProps, string[]>('NLUVariableCreate');
export const useVariablePromptModal = () => useModal<VariablePromptProps, VariablePromptResult>('VariablePrompt');
export const useBulkImportSlotsModal = () => useModal<void, SlotsBulkImportResult>('BulkImportSlots');
export const useCreateVariableStateModal = () => useModal<CreateVariableStateModalProps>('VariableStateCreate');
export const useBulkImportUtterancesModal = () => useModal<BulkImportUtterancesProps, BulkImportUtterancesResult>('BulkImportUtterances');
