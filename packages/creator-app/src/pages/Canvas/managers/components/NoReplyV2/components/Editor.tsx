import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { ChatModels } from '@voiceflow/chat-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import * as History from '@/ducks/history';
import { useDispatch } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { EngineContext } from '@/pages/Canvas/contexts';

import PathSection from '../../PathSection';
import RepromptsSection from '../../RepromptsSection';
import HelpTooltip from './HelpTooltip';
import TimeoutSection from './TimeoutSection';

interface Data {
  noReply: Realtime.NodeData.NoReply;
}

const Editor: React.FC = () => {
  const engine = React.useContext(EngineContext)!;
  const editor = EditorV2.useEditor<Data>();

  const transaction = useDispatch(History.transaction);

  const { noReply } = editor.data;

  const onChange = async (data: Partial<Realtime.NodeData.NoReply>) => {
    await editor.onChange({ noReply: { ...noReply, ...data } as Realtime.NodeData.NoReply });
  };

  const onChangeReprompts = async (reprompts: Array<ChatModels.Prompt | Realtime.NodeData.VoicePrompt>) => {
    if (!reprompts.length) {
      await onChange({ types: Utils.array.withoutValue(noReply.types, BaseNode.Utils.NoReplyType.REPROMPT), reprompts: [] });
    } else {
      await onChange({
        types: Utils.array.unique([...noReply.types, BaseNode.Utils.NoReplyType.REPROMPT]),
        reprompts,
      } as Partial<Realtime.NodeData.NoReply>);
    }
  };

  const onAddPath = () =>
    transaction(async () => {
      await engine.port.addBuiltin(editor.nodeID, BaseModels.PortType.NO_REPLY);
      await onChange({ types: Utils.array.unique([...noReply.types, BaseNode.Utils.NoReplyType.PATH]) });
    });

  const onRemovePath = async () => {
    const noReplyPortID = editor.node.ports.out.builtIn[BaseModels.PortType.NO_REPLY];

    await transaction(async () => {
      if (noReplyPortID) {
        await engine.port.removeBuiltin(BaseModels.PortType.NO_REPLY, noReplyPortID);
      }

      await onChange({ types: Utils.array.withoutValue(noReply.types, BaseNode.Utils.NoReplyType.PATH) });
    });
  };

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader onBack={editor.goBack} />}
      footer={
        <EditorV2.DefaultFooter tutorial={{ content: <HelpTooltip /> }}>
          <EditorV2.FooterActionsButton
            actions={[
              {
                label: noReply.randomize ? 'Unrandomize responses' : 'Randomize responses',
                onClick: () => onChange({ randomize: !noReply.randomize }),
              },
            ]}
            placement="bottom-end"
          />
        </EditorV2.DefaultFooter>
      }
    >
      <TimeoutSection timeout={noReply.timeout} onChange={(timeout) => onChange({ timeout })} />

      <SectionV2.Divider />

      <RepromptsSection
        title="No reply"
        active={!!noReply.types.includes(BaseNode.Utils.NoReplyType.REPROMPT)}
        onChange={onChangeReprompts}
        reprompts={noReply.reprompts ?? []}
        isRandomized={noReply.randomize}
      />

      <SectionV2.Divider />

      <PathSection
        onAdd={onAddPath}
        pathName={noReply.pathName ?? ''}
        onRemove={onRemovePath}
        onRename={(pathName) => onChange({ pathName })}
        collapsed={!noReply.types.includes(BaseNode.Utils.NoReplyType.PATH)}
      />
    </EditorV2>
  );
};

export default EditorV2.withRedirectToRoot<Partial<Data>>((editor) => !editor.data.noReply)(Editor);
