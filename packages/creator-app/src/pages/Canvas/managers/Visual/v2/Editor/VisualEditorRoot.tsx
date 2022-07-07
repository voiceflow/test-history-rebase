import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2, UploadV2 } from '@voiceflow/ui';
import React from 'react';

import VariablesInput from '@/components/VariablesInput';
import * as Documentation from '@/config/documentation';
import { useImageDimensions } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

const VisualRootEditor: React.FC = () => {
  const { data, onChange } = EditorV2.useEditor<BaseNode.Visual.ImageStepData, Realtime.NodeData.VisualBuiltInPorts>();
  const dimensions = useImageDimensions({ url: data.image });

  return (
    <EditorV2 header={<EditorV2.DefaultHeader />} footer={<EditorV2.DefaultFooter tutorial={Documentation.IMAGE_STEP} />}>
      <SectionV2.SimpleSection isAccent>
        <UploadV2.Image
          rootDropAreaProps={{ pb: '4px' }}
          renderInput={VariablesInput.renderInput}
          value={data.image}
          onChange={(image) => onChange({ image })}
          ratio={dimensions?.ratio}
        />
      </SectionV2.SimpleSection>
    </EditorV2>
  );
};

export default VisualRootEditor;
