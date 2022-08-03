import { Button } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';
import EditorV2, { EditorV2Types } from '@/pages/Canvas/components/EditorV2';

interface FooterProps {
  tutorial?: EditorV2Types.DefaultFooter.Props['tutorial'];
}

const Footer: React.FC<FooterProps> = ({ tutorial = Documentation.API_STEP }) => {
  const sendRequestModal = useModals(ModalType.INTEGRATION_EDITOR_SEND_REQUEST_MODAL);

  return (
    <EditorV2.DefaultFooter tutorial={tutorial}>
      <Button variant={Button.Variant.PRIMARY} onClick={() => sendRequestModal.open()} squareRadius>
        Send Request
      </Button>
    </EditorV2.DefaultFooter>
  );
};

export default Footer;
