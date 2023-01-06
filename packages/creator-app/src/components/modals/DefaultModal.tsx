import { Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import { ModalBody, ModalFooter, UncontrolledModal } from '@/components/Modal';

import { UncontrolledBackdrop } from './ModalBackdrop';

export interface DefaultModalProps {
  open?: boolean;
  toggle?: () => void;
  header: React.ReactNode;
  content: React.ReactNode;
  noPadding?: boolean;
  hideFooter?: boolean;
}

const DefaultModal: React.OldFC<DefaultModalProps> = ({ open, toggle, header, content, noPadding, hideFooter }) => (
  <>
    {!!open && <UncontrolledBackdrop onClose={() => toggle?.()} />}

    <UncontrolledModal id="default" title={header} isOpened={!!open} onClose={toggle}>
      <ModalBody style={{ padding: noPadding ? '0' : undefined }}>{content}</ModalBody>

      {!hideFooter && (
        <ModalFooter justifyContent="center">
          <Button variant={ButtonVariant.TERTIARY} onClick={toggle}>
            Close
          </Button>
        </ModalFooter>
      )}
    </UncontrolledModal>
  </>
);

export default DefaultModal;
