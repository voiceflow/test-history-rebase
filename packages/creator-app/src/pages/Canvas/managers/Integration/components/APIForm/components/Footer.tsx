import { Button } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';
import * as ModalsV2 from '@/ModalsV2';
import EditorV2, { EditorV2Types } from '@/pages/Canvas/components/EditorV2';

import { BaseFormProps } from '../types';

interface FooterProps extends BaseFormProps {
  tutorial?: EditorV2Types.DefaultFooter.Props['tutorial'];
}

const Footer: React.FC<FooterProps> = ({ editor, tutorial = Documentation.API_STEP }) => {
  const sendRequestModal = ModalsV2.useModal(ModalsV2.Canvas.Integration.SendRequest);

  return (
    <EditorV2.DefaultFooter tutorial={tutorial}>
      <Button variant={Button.Variant.PRIMARY} onClick={() => sendRequestModal.openVoid({ data: editor.data })} squareRadius>
        Send Request
      </Button>
    </EditorV2.DefaultFooter>
  );
};

export default Footer;
