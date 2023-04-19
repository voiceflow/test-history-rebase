import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import * as History from '@/ducks/history';
import { useDispatch } from '@/hooks/realtime';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { EngineContext } from '@/pages/Canvas/contexts';
import { Actions } from '@/pages/Canvas/managers/components';
import PathSection from '@/pages/Canvas/managers/components/PathSection';
import HelpTooltip from '@/pages/Canvas/managers/IfV2/components/HelpTooltip';

interface Data {
  noMatch: BaseNode.IfV2.IfNoMatch;
}

const DEFAULT_IF_NO_MATCH_LABEL = 'Else';

const NoMatchEditor: React.FC = () => {
  const engine = React.useContext(EngineContext)!;
  const editor = EditorV2.useEditor<Data, Realtime.NodeData.IfV2BuiltInPorts>();

  const transaction = useDispatch(History.transaction);

  const { noMatch } = editor.data;
  const noMatchPortID = editor.node.ports.out.builtIn[BaseModels.PortType.NO_MATCH];

  const onChange = async (data: Partial<BaseNode.IfV2.IfNoMatch>) => {
    await editor.onChange({ noMatch: { ...noMatch, ...data } });
  };

  const onAddPath = () =>
    transaction(async () => {
      await engine.port.addBuiltin(editor.nodeID, BaseModels.PortType.NO_MATCH);

      await onChange({ type: BaseNode.IfV2.IfNoMatchType.PATH, pathName: DEFAULT_IF_NO_MATCH_LABEL });
    });

  const onRemovePath = () =>
    transaction(async () => {
      if (noMatchPortID) {
        await engine.port.removeBuiltin(noMatchPortID);
      }

      await onChange({ type: BaseNode.IfV2.IfNoMatchType.NONE });
    });

  const collapsed = noMatch.type === BaseNode.IfV2.IfNoMatchType.NONE || !noMatchPortID;

  return (
    <EditorV2 header={<EditorV2.DefaultHeader onBack={editor.goBack} />} footer={<EditorV2.DefaultFooter tutorial={{ content: <HelpTooltip /> }} />}>
      <PathSection
        onAdd={onAddPath}
        pathName={noMatch.pathName && noMatch.pathName !== DEFAULT_IF_NO_MATCH_LABEL ? noMatch.pathName : ''}
        onRemove={onRemovePath}
        onRename={(pathName) => onChange({ pathName: pathName || DEFAULT_IF_NO_MATCH_LABEL })}
        collapsed={collapsed}
        placeholder="Enter path label"
      />

      {!collapsed && (
        <>
          <SectionV2.Divider inset />

          <Actions.Section portID={noMatchPortID} editor={editor} />
        </>
      )}
    </EditorV2>
  );
};
export default EditorV2.withRedirectToRoot<Partial<Data>>((editor) => !editor.data.noMatch)(NoMatchEditor);
