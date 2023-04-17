import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import * as Creator from '@/ducks/creator';
import { useSelector } from '@/hooks';
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
  const noMatchLinkID = useSelector(Creator.focusedNoMatchLinkIDSelector);
  const { noMatch } = editor.data;

  const onChange = async (data: Partial<BaseNode.IfV2.IfNoMatch>) => {
    await editor.onChange({ noMatch: { ...noMatch, ...data } });
  };

  const onAddPath = async () => {
    await onChange({ type: BaseNode.IfV2.IfNoMatchType.PATH, pathName: DEFAULT_IF_NO_MATCH_LABEL });
  };

  const onRemovePath = async () => {
    if (noMatchLinkID) {
      await engine.link.remove(noMatchLinkID);
    }
    await onChange({ type: BaseNode.IfV2.IfNoMatchType.NONE });
  };

  const collapsed = noMatch.type === BaseNode.IfV2.IfNoMatchType.NONE;

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

          <Actions.Section portID={editor.node.ports.out.builtIn[BaseModels.PortType.NO_MATCH]} editor={editor} />
        </>
      )}
    </EditorV2>
  );
};
export default EditorV2.withRedirectToRoot<Partial<Data>>((editor) => !editor.data.noMatch)(NoMatchEditor);
