import { Box, Button, Modal } from '@voiceflow/ui';
import React from 'react';

interface FooterProps {
  onCreate: () => void;
  onCancel: () => void;
}

const Footer: React.FC<FooterProps> = ({ onCreate, onCancel }) => (
  <Modal.Footer>
    <Box.FlexAlignEnd gap={10}>
      <Button onClick={onCancel} variant={Button.Variant.TERTIARY} squareRadius>
        Cancel
      </Button>

      <Button onClick={onCreate} variant={Button.Variant.PRIMARY} squareRadius>
        Create
      </Button>
    </Box.FlexAlignEnd>
  </Modal.Footer>
);

export default Footer;
