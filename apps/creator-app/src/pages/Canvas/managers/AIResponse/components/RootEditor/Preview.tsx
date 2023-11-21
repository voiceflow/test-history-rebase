import { SectionV2, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { copyWithToast } from '@/utils/clipboard';

import { ResponsePreviewContainer } from './styles';

const Preview: React.FC<{ preview?: string | null }> = ({ preview }) => {
  if (!preview) return null;

  return (
    <SectionV2.SimpleContentSection
      header={
        <SectionV2.Title bold secondary>
          Response Preview
        </SectionV2.Title>
      }
      headerProps={{ bottomUnit: 1.375, topUnit: 0 }}
      contentProps={{ bottomOffset: 3 }}
    >
      <ResponsePreviewContainer>
        <SvgIcon icon="copy" variant={SvgIcon.Variant.STANDARD} clickable onClick={copyWithToast(preview)} />
        {preview}
      </ResponsePreviewContainer>
    </SectionV2.SimpleContentSection>
  );
};

export default Preview;
