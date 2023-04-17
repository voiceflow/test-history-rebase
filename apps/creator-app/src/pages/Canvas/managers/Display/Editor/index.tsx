import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, SectionV2, Tabs } from '@voiceflow/ui';
import React from 'react';

import * as APL from '@/ducks/apl';
import { useDispatch } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import { displayFactory } from '../constants';
import { HelpTooltip, JSONEditor, SplashEditor } from './components';

const tabs = [
  { label: 'Basic', type: BaseNode.Visual.APLType.SPLASH },
  { label: 'Custom', type: BaseNode.Visual.APLType.JSON },
];

const DisplayEditor: NodeEditorV2<BaseNode.Visual.APLStepData, Realtime.NodeData.VisualBuiltInPorts> = () => {
  const editor = EditorV2.useEditor<BaseNode.Visual.APLStepData, Realtime.NodeData.VisualBuiltInPorts>();
  const { data } = editor;
  const resolveAPL = useDispatch(APL.resolveAPL);
  const previewModal = ModalsV2.useModal(ModalsV2.APLPreview);

  const canCreatePreview =
    (data.aplType === BaseNode.Visual.APLType.SPLASH && !!(data.title || data.imageURL)) ||
    (data.aplType === BaseNode.Visual.APLType.JSON && !!data.jsonFileName);

  const openPreviewModal = async () => {
    const result = await resolveAPL(data);

    previewModal.open({ apl: result.apl, commands: result.commands, displayData: result.data });
  };

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader title="APL" />}
      footer={
        <EditorV2.DefaultFooter tutorial={{ content: <HelpTooltip /> }}>
          {(!!data.imageURL || !!data.title || !!data.document) && (
            <Button
              onClick={() => canCreatePreview && openPreviewModal()}
              variant={Button.Variant.SECONDARY}
              isActive={false}
              squareRadius
              small
              flat
            >
              Preview
            </Button>
          )}
        </EditorV2.DefaultFooter>
      }
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
