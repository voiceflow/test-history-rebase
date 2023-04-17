import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2, UploadV2 } from '@voiceflow/ui';
import React from 'react';

import VariablesInput from '@/components/VariablesInput';
import * as Documentation from '@/config/documentation';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';
import { imageSizeFromUrl } from '@/utils/file';

const Editor: NodeEditorV2<Realtime.NodeData.Visual, Realtime.NodeData.VisualBuiltInPorts> = (editor) => {
  const onChange = async (image: string | null) => {
    editor.onChange({ image, dimensions: null });

    if (image) {
      try {
        const size = await imageSizeFromUrl(image);

        editor.onChange({ dimensions: size, frameType: BaseNode.Visual.FrameType.AUTO });
      } catch {
        // empty
      }
    }
  };

  return (
    <EditorV2 header={<EditorV2.DefaultHeader />} footer={<EditorV2.DefaultFooter tutorial={Documentation.IMAGE_STEP} />}>
      <SectionV2.SimpleSection isAccent>
        {editor.data.visualType === BaseNode.Visual.VisualType.IMAGE && (
          <UploadV2.Image
            value={editor.data.image}
            ratio={editor.data?.dimensions ? (editor.data.dimensions.height / editor.data.dimensions.width) * 100 : null}
            onChange={onChange}
            renderInput={VariablesInput.renderInput}
          />
        )}
      </SectionV2.SimpleSection>
    </EditorV2>
  );
};

export default Editor;
