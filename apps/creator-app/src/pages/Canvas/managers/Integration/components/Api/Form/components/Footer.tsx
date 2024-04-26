import { Button } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';
import { useFillVariables } from '@/hooks/variable';
import * as ModalsV2 from '@/ModalsV2';
import type { EditorV2Types } from '@/pages/Canvas/components/EditorV2';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { encodeCustomAPIData } from '@/utils/integration';

import TLSEditor from '../../TLSEditor';
import type { BaseFormProps } from '../types';

interface FooterProps extends BaseFormProps {
  tutorial?: EditorV2Types.DefaultFooter.Props['tutorial'];
}

const Footer: React.FC<FooterProps> = ({ editor, tutorial = Documentation.API_STEP }) => {
  const sendRequestModal = ModalsV2.useModal(ModalsV2.Canvas.Integration.SendRequest);
  const fillVariables = useFillVariables();

  const sendRequest = async () => {
    const context = await fillVariables(encodeCustomAPIData(editor.data));
    if (!context) return;

    sendRequestModal.open({ data: context });
  };

  const onRemoveTLS = () => editor.onChange({ tls: null });

  const onAddTLS = () => {
    editor.onChange({ tls: { cert: null, key: null } });
    editor.goToNested(TLSEditor.PATH);
  };

  const { tls } = editor.data;

  return (
    <EditorV2.DefaultFooter tutorial={tutorial}>
      <EditorV2.FooterActionsButton
        actions={[{ label: tls ? 'Remove certificates' : 'Add certificates', onClick: tls ? onRemoveTLS : onAddTLS }]}
      />

      <Button variant={Button.Variant.PRIMARY} onClick={sendRequest} squareRadius>
        Send Request
      </Button>
    </EditorV2.DefaultFooter>
  );
};

export default Footer;
