import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import * as Creator from '@/ducks/creator';
import * as History from '@/ducks/history';
import { useDispatch, useSelector } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { EngineContext } from '@/pages/Canvas/contexts';

import Actions from '../../Actions';
import PathSection from '../../PathSection';
import RepromptsSection from '../../RepromptsSection';
import HelpTooltip from './HelpTooltip';

interface Data {
  noMatch: Realtime.NodeData.NoMatch;
}

const RootEditor: React.FC = () => {
  const engine = React.useContext(EngineContext)!;
  const editor = EditorV2.useEditor<Data>();

  const noMatchLinkID = useSelector(Creator.focusedNoMatchLinkIDSelector);

  const transaction = useDispatch(History.transaction);

  const { noMatch } = editor.data;

  const onChange = async (data: Partial<Realtime.NodeData.NoMatch>) => {
    if (Utils.object.shallowPartialEquals(noMatch, data)) return;
    await editor.onChange({ noMatch: { ...noMatch, ...data } as Realtime.NodeData.NoMatch });
  };

  const onChangeReprompts = async (reprompts: Platform.Base.Models.Prompt.Model[]) => {
    if (!reprompts.length) {
      await onChange({ types: Utils.array.withoutValue(noMatch.types, BaseNode.Utils.NoMatchType.REPROMPT), reprompts: [] });
    } else {
      await onChange({
        types: Utils.array.unique([...noMatch.types, BaseNode.Utils.NoMatchType.REPROMPT]),
        reprompts,
      } as Realtime.NodeData.NoMatch);
    }
  };

  const onAddPath = async () => {
    await onChange({ types: Utils.array.unique([...noMatch.types, BaseNode.Utils.NoMatchType.PATH]) });
  };

  const onRemovePath = () =>
    transaction(async () => {
      if (noMatchLinkID) {
        await engine.link.remove(noMatchLinkID);
      }

      await onChange({ types: Utils.array.withoutValue(noMatch.types, BaseNode.Utils.NoMatchType.PATH) });
    });

  const withPath = noMatch.types.includes(BaseNode.Utils.NoMatchType.PATH);
  const noMatchPortID = editor.node.ports.out.builtIn[BaseModels.PortType.NO_MATCH];

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader onBack={editor.goBack} />}
      footer={
        <EditorV2.DefaultFooter tutorial={{ content: <HelpTooltip /> }}>
          <EditorV2.FooterActionsButton
            actions={[
              {
                label: noMatch.randomize ? 'Unrandomize responses' : 'Randomize responses',
                onClick: () => onChange({ randomize: !noMatch.randomize }),
              },
            ]}
            placement="bottom-end"
          />
        </EditorV2.DefaultFooter>
      }
    >
      <RepromptsSection
        title="No match"
        active={!!noMatch.types.includes(BaseNode.Utils.NoMatchType.REPROMPT)}
        onChange={onChangeReprompts}
        reprompts={noMatch.reprompts}
        isRandomized={noMatch.randomize}
      />

      <SectionV2.Divider />

      <PathSection
        onAdd={onAddPath}
        pathName={noMatch.pathName ?? ''}
        onRemove={onRemovePath}
        onRename={(pathName) => onChange({ pathName })}
        collapsed={!withPath}
      />

      {withPath && !!noMatchPortID && (
        <>
          <SectionV2.Divider inset />

          <Actions.Section editor={editor} portID={noMatchPortID} withoutURL />
        </>
      )}
    </EditorV2>
  );
};

export default EditorV2.withRedirectToRoot<Partial<Data>>((editor) => !editor.data.noMatch)(RootEditor);
