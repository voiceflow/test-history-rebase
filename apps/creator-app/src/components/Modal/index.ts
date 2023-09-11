import { Modal as UIModal } from '@voiceflow/ui-next';

import { Modal as ModalComponent } from './Modal.component';
import { ModalBackdrop } from './ModalBackdrop/ModalBackdrop.component';
import { ModalBody } from './ModalBody/ModalBody.component';
import { ModalPlaceholder } from './ModalPlaceholder/ModalPlaceholder.component';

export const Modal = Object.assign(ModalComponent, {
  Body: ModalBody,
  Header: UIModal.Header,
  Footer: UIModal.Footer,
  Backdrop: ModalBackdrop,
  Placeholder: ModalPlaceholder,
});
