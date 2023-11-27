import type { Entity, Intent } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';

import type { Props as ConfirmProps } from '../modals/Confirm';
import type { IEntityCreateModal } from '../modals/Entity/EntityCreate.modal';
import type { IEntityEditModal } from '../modals/Entity/EntityEdit.modal';
import type { Props as ErrorProps } from '../modals/Error';
import type { IIntentCreateModal } from '../modals/Intent/IntentCreate/IntentCreate.interface';
import type { IIntentEditModal } from '../modals/Intent/IntentEdit.modal';
import type { Result as SlotsBulkImportResult } from '../modals/NLU/BulkImport/Slots';
import type { Props as BulkImportUtterancesProps, Result as BulkImportUtterancesResult } from '../modals/NLU/BulkImport/Utterances';
import type { NLUEntityCreateProps } from '../modals/NLU/Entity/Create';
import type { NLUEntityEditProps } from '../modals/NLU/Entity/Edit';
import type { NLUIntentCreateProps, NLUIntentCreateResult } from '../modals/NLU/Intent/Create';
import type { NLUIntentEditProps } from '../modals/NLU/Intent/Edit';
import type { NLUVariableCreateProps } from '../modals/NLU/Variable/Create';
import type { PaymentModalProps } from '../modals/Payment';
import type { Props as SuccessProps } from '../modals/Success';
import type { UpgradeModal } from '../modals/Upgrade';
import type { Props as VariablePromptProps, Result as VariablePromptResult } from '../modals/VariablePrompt';
import { useModal } from './modal';

// needs these to fix circular deps issue
export const useErrorModal = () => useModal<ErrorProps>('Error');
export const useSuccessModal = () => useModal<SuccessProps>('Success');
export const useConfirmModal = () => useModal<ConfirmProps>('Confirm');
export const useUpgradeModal = () => useModal<UpgradeModal>('Upgrade');
export const useAddSeatsModal = () => useModal('AddSeats');
export const usePaymentModal = () => useModal<PaymentModalProps>('Payment');

export const useEditEntityModal = () => useModal<NLUEntityEditProps>('NLUEntityEdit');
export const useCreateEntityModal = () => useModal<NLUEntityCreateProps, Realtime.Slot>('NLUEntityCreate');

export const useEditIntentModal = () => useModal<NLUIntentEditProps>('NLUIntentEdit');
export const useCreateIntentModal = () => useModal<NLUIntentCreateProps, NLUIntentCreateResult>('NLUIntentCreate');
export const useBulkImportUtterancesModal = () => useModal<BulkImportUtterancesProps, BulkImportUtterancesResult>('BulkImportUtterances');

export const useCreateVariableModal = () => useModal<NLUVariableCreateProps, string[]>('NLUVariableCreate');
export const useVariablePromptModal = () => useModal<VariablePromptProps, VariablePromptResult>('VariablePrompt');

export const useBulkImportSlotsModal = () => useModal<void, SlotsBulkImportResult>('BulkImportSlots');
export const useCreateVariableStateModal = () => useModal('VariableStateCreate');

// CMS

export const useEntityEditModalV2 = () => useModal<IEntityEditModal>('EntityEditModal');
export const useEntityCreateModalV2 = () => useModal<IEntityCreateModal, Entity>('EntityCreateModal');

export const useIntentEditModalV2 = () => useModal<IIntentEditModal>('IntentEditModal');
export const useIntentCreateModalV2 = () => useModal<IIntentCreateModal, Intent>('IntentCreateModal');
