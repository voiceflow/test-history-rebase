import { BoxFlexAlignEnd, Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import Modal from '@/components/Modal';

interface FooterProps {
  onCreate: () => void;
  onCancel: () => void;
  isCreating: boolean;
}

const Footer: React.FC<FooterProps> = ({ onCreate, onCancel, isCreating }) => (
  <Modal.Footer>
    <BoxFlexAlignEnd gap={10}>
      <Button onClick={onCancel} variant={ButtonVariant.TERTIARY} squareRadius>
        Cancel
      </Button>

      <Button disabled={isCreating} onClick={onCreate} variant={ButtonVariant.PRIMARY} squareRadius>
        Create
      </Button>
    </BoxFlexAlignEnd>
  </Modal.Footer>
);

export default Footer;
