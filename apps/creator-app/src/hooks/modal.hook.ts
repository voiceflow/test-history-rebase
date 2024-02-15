import type { Entity, Flow, Folder, Intent, Variable } from '@voiceflow/dtos';

import { useModal } from '@/ModalsV2/modal.hook';
import type { Props as ConfirmProps } from '@/ModalsV2/modals/Confirm';
import type { IConformV2Modal } from '@/ModalsV2/modals/ConfirmV2/ConfirmV2.interface';
import type { IEntityCreateModal } from '@/ModalsV2/modals/Entity/EntityCreate.modal';
import type { IEntityEditModal } from '@/ModalsV2/modals/Entity/EntityEdit.modal';
import type { Props as ErrorProps } from '@/ModalsV2/modals/Error';
import type { IFolderCreateModal } from '@/ModalsV2/modals/Folder/FolderCreate.modal';
import type { IntentBulkImportUtterancesModalProps } from '@/ModalsV2/modals/Intent/IntentBulkImportUtterances.modal';
import type { IIntentCreateModal } from '@/ModalsV2/modals/Intent/IntentCreate/IntentCreate.interface';
import type { IIntentEditModal } from '@/ModalsV2/modals/Intent/IntentEdit.modal';
import type { NLUVariableCreateProps } from '@/ModalsV2/modals/NLU/Variable/Create';
import type { PaymentModalProps } from '@/ModalsV2/modals/Payment';
import type { Props as SuccessProps } from '@/ModalsV2/modals/Success';
import type { UpgradeModal } from '@/ModalsV2/modals/Upgrade';
import type { IVariableCreateModal } from '@/ModalsV2/modals/Variable/VariableCreate.modal';
import type { IVariableEditModal } from '@/ModalsV2/modals/Variable/VariableEdit.modal';
import type { Props as VariablePromptProps, Result as VariablePromptResult } from '@/ModalsV2/modals/VariablePrompt';

export { useModal } from '@/ModalsV2/modal.hook';

// needs these to fix circular deps issue
export const useErrorModal = () => useModal<ErrorProps>('Error');
export const useSuccessModal = () => useModal<SuccessProps>('Success');
export const useUpgradeModal = () => useModal<UpgradeModal>('Upgrade');
export const useAddSeatsModal = () => useModal('AddSeats');
export const usePaymentModal = () => useModal<PaymentModalProps>('Payment');

export const useCreateVariableModal = () => useModal<NLUVariableCreateProps, string[]>('NLUVariableCreate');
export const useVariablePromptModal = () => useModal<VariablePromptProps, VariablePromptResult>('VariablePrompt');

export const useCreateVariableStateModal = () => useModal('VariableStateCreate');

export const useEntityEditModal = () => useModal<IEntityEditModal>('EntityEditModal');
export const useEntityCreateModal = () => useModal<IEntityCreateModal, Entity>('EntityCreateModal');

export const useVariableEditModal = () => useModal<IVariableEditModal>('VariableEditModal');
export const useVariableCreateModal = () => useModal<IVariableCreateModal, Variable>('VariableCreateModal');

export const useFolderCreateModal = () => useModal<IFolderCreateModal, Folder>('FolderCreateModal');

export const useFlowEditModal = () => useModal<IVariableEditModal>('FlowEditModal');
export const useFlowCreateModal = () => useModal<IVariableCreateModal, Flow>('FlowCreateModal');

export const useIntentEditModal = () => useModal<IIntentEditModal>('IntentEditModal');
export const useIntentCreateModal = () => useModal<IIntentCreateModal, Intent>('IntentCreateModal');
export const useIntentBulkImportUtterancesModal = () => useModal<IntentBulkImportUtterancesModalProps>('IntentBulkImportUtterancesModal');

/**
 * @deprecated use useConfirmV2Modal instead
 */
export const useConfirmModal = () => useModal<ConfirmProps>('Confirm');
export const useConfirmV2Modal = () => useModal<IConformV2Modal>('ConfirmV2');
