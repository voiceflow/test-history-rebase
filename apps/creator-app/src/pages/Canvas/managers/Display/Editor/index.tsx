import { BaseNode } from '@voiceflow/base-types';
import type * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2, Tabs } from '@voiceflow/ui';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';
import type { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import { displayFactory } from '../constants';
import { HelpTooltip, JSONEditor, SplashEditor } from './components';

const tabs = [
  { label: 'Basic', type: BaseNode.Visual.APLType.SPLASH },
  { label: 'Custom', type: BaseNode.Visual.APLType.JSON },
];

const DisplayEditor: NodeEditorV2<BaseNode.Visual.APLStepData, Realtime.NodeData.VisualBuiltInPorts> = () => {
  const editor = EditorV2.useEditor<BaseNode.Visual.APLStepData, Realtime.NodeData.VisualBuiltInPorts>();
  const { data } = editor;

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader title="APL" />}
      footer={<EditorV2.DefaultFooter tutorial={{ content: <HelpTooltip /> }} />}
    >
      <SectionV2.SimpleSection isAccent>
        <Tabs value={data.aplType} onChange={(aplType) => editor.onChange({ ...data, ...displayFactory(aplType) })}>
          {tabs.map(({ label, type }) => (
            <Tabs.Tab key={type} value={type}>
              {label}
            </Tabs.Tab>
          ))}
        </Tabs>
      </SectionV2.SimpleSection>

      {data.aplType === BaseNode.Visual.APLType.SPLASH && (
        <SplashEditor
          title={data.title!}
          imageURL={data.imageURL!}
          onChange={(splashData) =>
            editor.onChange({
              ...data,
              ...splashData,
            })
          }
        />
      )}
      {data.aplType === BaseNode.Visual.APLType.JSON && (
        <JSONEditor
          datasource={data.datasource}
          aplCommands={data.aplCommands}
          jsonFileName={data.jsonFileName!}
          document={data.document}
          onChange={(JSONData) =>
            editor.onChange({
              ...data,
              ...JSONData,
            })
          }
        />
      )}
    </EditorV2>
  );
};

export default DisplayEditor;
