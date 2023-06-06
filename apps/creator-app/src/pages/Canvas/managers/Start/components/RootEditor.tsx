import * as Realtime from '@voiceflow/realtime-sdk';
import { COLOR_PICKER_CONSTANTS, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as VersionV2 from '@/ducks/versionV2';
import { useActiveProjectTypeConfig, useSelector } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

import CommandsSection from './CommandsSection';
import InvocationNameSection from './InvocationNameSection';
import StartLabelSection from './StartLabelSection';

const RootEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.Start>();
  const projectConfig = useActiveProjectTypeConfig();

  const activeDiagramID = useSelector(CreatorV2.activeDiagramIDSelector);
  const versionRootDiagramID = useSelector(VersionV2.active.rootDiagramIDSelector);

  // to render invocation name section only for version root diagram
  const isVersionRootDiagramActive = activeDiagramID === versionRootDiagramID;

  return (
    <EditorV2
      header={
        <EditorV2.ChipHeader
          title="Start"
          color={editor.data.blockColor}
          colorScheme={COLOR_PICKER_CONSTANTS.ColorScheme.BLACK}
          onChangeColor={(blockColor) => editor.onChange({ blockColor })}
        />
      }
      footer={<EditorV2.DefaultFooter tutorial={Documentation.COMMAND_STEP} />}
    >
      {isVersionRootDiagramActive && projectConfig.project.invocationName ? <InvocationNameSection /> : <StartLabelSection />}

      <SectionV2.Divider />

      <CommandsSection />
    </EditorV2>
  );
};

export default RootEditor;
