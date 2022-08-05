import 'brace';
import 'brace/theme/cobalt';
import 'brace/mode/javascript';
import 'brace/mode/sh';
import 'brace/mode/python';
import 'brace/mode/json';

import { Box, SvgIcon, TippyTooltip, toast } from '@voiceflow/ui';
import React from 'react';

import { copy } from '@/utils/clipboard';

import { Header, Option, SampleAceEditor } from './components';
import { Sample } from './types';

const SampleEditor: React.FC<{ samples: Sample[]; wrap?: boolean }> = ({ samples = [], wrap = true }) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const { sample, language } = samples[selectedIndex] || { sample: '', language: '' };

  const handleCopySnippet = () => {
    toast.success('Copied Code Snippet');
    copy(sample);
  };

  return (
    <Box borderRadius={5} overflow="hidden">
      <Header>
        <Box>
          {samples.map(({ label }, index) => (
            <Option key={index} active={selectedIndex === index} onClick={() => setSelectedIndex(index)}>
              {label}
            </Option>
          ))}
        </Box>
        <TippyTooltip title="Copy">
          <SvgIcon icon="copy" onClick={handleCopySnippet} color="#becedc" clickable />
        </TippyTooltip>
      </Header>
      <SampleAceEditor
        value={sample}
        showGutter
        mode={language}
        focus={false}
        highlightActiveLine={false}
        setOptions={{ useWorker: false, indentedSoftWrap: false, wrap, maxLines: Infinity, fontSize: 15 }}
      />
    </Box>
  );
};

export default SampleEditor;
