import { Box, SectionV2, UploadV2 } from '@voiceflow/ui';
import React from 'react';

import VariablesInput from '@/components/VariablesInput';
import { FormControl } from '@/pages/Canvas/components/Editor';

interface SplashEditorProps {
  title: string;
  onChange: (data: { title?: string; imageURL?: string }) => void;
  imageURL: string | null;
}

const SplashEditor: React.FC<SplashEditorProps> = ({ title, onChange, imageURL }) => (
  <Box bg="#fdfdfd">
    <SectionV2.Content>
      <FormControl>
        <VariablesInput value={title} onBlur={({ text }) => onChange({ title: text })} placeholder="Enter title, { to add variable" autoFocus />
      </FormControl>

      <FormControl>
        <UploadV2.Image
          onlyUpload
          value={imageURL}
          onChange={(newUrl) => onChange({ imageURL: newUrl || '' })}
          renderInput={VariablesInput.renderInput}
        />
      </FormControl>
    </SectionV2.Content>
  </Box>
);

export default SplashEditor;
