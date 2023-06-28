import { Box, Preview, TippyTooltip, toast } from '@voiceflow/ui';
import React from 'react';

import { copy } from '@/utils/clipboard';

import { Header, Option } from './styled';
import { Sample } from './types';

export * from './types';

const SampleEditor: React.FC<{ samples: Sample[] }> = ({ samples = [] }) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const { sample, language } = samples[selectedIndex] || { sample: '', language: '' };

  const handleCopySnippet = () => {
    toast.success('Copied Code Snippet');
    copy(sample);
  };

  return (
    <Box borderRadius={8} overflow="hidden" backgroundColor={Preview.Colors.GREY_DARK_BACKGROUND_COLOR}>
      <Header>
        <Box>
          {samples.map(({ label }, index) => (
            <Option key={index} active={selectedIndex === index} onClick={() => setSelectedIndex(index)}>
              {label}
            </Option>
          ))}
        </Box>

        <TippyTooltip content="Copy">
          <Preview.ButtonIcon icon="copy" onClick={handleCopySnippet} />
        </TippyTooltip>
      </Header>
      <Preview.Code code={sample} wrapLongLines={false} language={language} padding="20px 24px" />
    </Box>
  );
};

export default SampleEditor;
