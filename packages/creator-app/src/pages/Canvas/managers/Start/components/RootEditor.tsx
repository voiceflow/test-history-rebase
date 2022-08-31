import * as Realtime from '@voiceflow/realtime-sdk';
import { COLOR_PICKER_CONSTANTS, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';
import * as CreatorV2 from '@/ducks/creatorV2';
import { useSelector } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { PlatformContext } from '@/pages/Project/contexts';
import { isPlatformWithInvocationName } from '@/utils/typeGuards';

import CommandsSection from './CommandsSection';
import { useNodeLabel } from './hooks';
import InvocationNameSection from './InvocationNameSection';
import StartLabelSection from './StartLabelSection';

const RootEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.Start>();

  const platform = React.useContext(PlatformContext)!;

  const isRootDiagram = useSelector(CreatorV2.isRootDiagramActiveSelector);

  const nodeLabel = useNodeLabel();

  return (
    <EditorV2
      header={
        <EditorV2.ChipHeader
          title={nodeLabel}
          color={editor.data.blockColor}
          colorScheme={COLOR_PICKER_CONSTANTS.ColorScheme.BLACK}
          onChangeColor={(blockColor) => editor.onChange({ blockColor })}
        />
      }
      footer={<EditorV2.DefaultFooter tutorial={Documentation.START_STEP} />}
    >
      {isRootDiagram && isPlatformWithInvocationName(platform) ? <InvocationNameSection /> : <StartLabelSection />}

      <SectionV2.Divider />

      <CommandsSection />
    </EditorV2>
  );
};

export default RootEditor;
