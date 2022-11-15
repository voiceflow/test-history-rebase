import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import * as History from '@/ducks/history';
import { useDispatch } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { EngineContext } from '@/pages/Canvas/contexts';

import Actions from '../../Actions';
import PathSection from '../../PathSection';
import RepromptsSection from '../../RepromptsSection';
import HelpTooltip from './HelpTooltip';
import TimeoutSection from './TimeoutSection';

interface Data {
  noReply: Realtime.NodeData.NoReply;
}

const RootEditor: React.FC = () => {
  const engine = React.useContext(EngineContext)!;
  const editor = EditorV2.useEditor<Data>();

  const transaction = useDispatch(History.transaction);

  const { noReply } = editor.data;

  const noReplyPortID = editor.node.ports.out.builtIn[BaseModels.PortType.NO_REPLY];

  const onChange = async (data: Partial<Realtime.NodeData.NoReply>) => {
    if (Utils.object.shallowPartialEquals(noReply, data)) return;

    await editor.onChange({ noReply: { ...noReply, ...data } as Realtime.NodeData.NoReply });
  };

  const onChangeReprompts = async (reprompts: Platform.Base.Models.Prompt.Model[]) => {
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
    await transaction(async () => {
      if (noReplyPortID) {
        await engine.port.removeBuiltin(noReplyPortID);
      }

      await onChange({ types: Utils.array.withoutValue(noReply.types, BaseNode.Utils.NoReplyType.PATH) });
    });
  };

  const withPath = noReply.types.includes(BaseNode.Utils.NoReplyType.PATH);

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
        collapsed={!withPath}
      />

      {withPath && !!noReplyPortID && (
        <>
          <SectionV2.Divider inset />

          <Actions.Section portID={noReplyPortID} editor={editor} withoutURL />
        </>
      )}
    </EditorV2>
  );
};

export default EditorV2.withRedirectToRoot<Partial<Data>>((editor) => !editor.data.noReply)(RootEditor);
