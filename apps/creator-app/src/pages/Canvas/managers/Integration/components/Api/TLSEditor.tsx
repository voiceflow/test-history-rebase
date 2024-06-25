import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import UploadV2 from '@/components/legacy/Upload/V2';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

const PATH = 'tls';

type TLS = NonNullable<Realtime.NodeData.CustomApi['tls']>;

const TLSEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.CustomApi, Realtime.NodeData.IntegrationBuiltInPorts>();

  const { tls } = editor.data;

  const onChangeTLS =
    <Key extends keyof TLS>(key: Key) =>
    (value: TLS[Key]) => {
      editor.onChange({ tls: { key: tls?.key ?? null, cert: tls?.cert ?? null, [key]: value } });
    };

  return (
    <EditorV2 header={<EditorV2.DefaultHeader onBack={editor.goBack} />} footer={<EditorV2.DefaultFooter />}>
      <SectionV2.SimpleContentSection
        header={
          <SectionV2.Title secondary bold>
            Certificate
          </SectionV2.Title>
        }
        isAccent
        contentProps={{ bottomOffset: 0 }}
        headerProps={{ topUnit: 3, bottomUnit: 1.5 }}
      >
        <UploadV2.TLS label="certificate" value={tls?.cert ?? ''} onChange={onChangeTLS('cert')} />
      </SectionV2.SimpleContentSection>
      <SectionV2.SimpleContentSection
        header={
          <SectionV2.Title secondary bold>
            Key
          </SectionV2.Title>
        }
        isAccent
        contentProps={{ bottomOffset: 3 }}
        headerProps={{ bottomUnit: 1.5 }}
      >
        <UploadV2.TLS label="key" value={tls?.key ?? ''} onChange={onChangeTLS('key')} />
      </SectionV2.SimpleContentSection>
    </EditorV2>
  );
};

export default Object.assign(TLSEditor, { PATH });
