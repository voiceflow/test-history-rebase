import * as Realtime from '@voiceflow/realtime-sdk';
import { Button } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';
import { useFeature } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import EditorV2, { EditorV2Types } from '@/pages/Canvas/components/EditorV2';

import TLSEditor from '../../TLSEditor';
import { BaseFormProps } from '../types';

interface FooterProps extends BaseFormProps {
  tutorial?: EditorV2Types.DefaultFooter.Props['tutorial'];
}

const Footer: React.FC<FooterProps> = ({ editor, tutorial = Documentation.API_STEP }) => {
  const sendRequestModal = ModalsV2.useModal(ModalsV2.Canvas.Integration.SendRequest);

  const tlsUpload = useFeature(Realtime.FeatureFlag.TLS_UPLOAD);

  const onRemoveTLS = () => editor.onChange({ tls: null });

  const onAddTLS = () => {
    editor.onChange({ tls: { cert: null, key: null } });
    editor.goToNested(TLSEditor.PATH);
  };

  const { tls } = editor.data;

  return (
    <EditorV2.DefaultFooter tutorial={tutorial}>
      {tlsUpload.isEnabled && (
        <EditorV2.FooterActionsButton
          actions={[{ label: tls ? 'Remove certificates' : 'Add certificates', onClick: tls ? onRemoveTLS : onAddTLS }]}
        />
      )}

      <Button variant={Button.Variant.PRIMARY} onClick={() => sendRequestModal.openVoid({ data: editor.data })} squareRadius>
        Send Request
      </Button>
    </EditorV2.DefaultFooter>
  );
};

export default Footer;
