import { Upload } from '@voiceflow/ui';
import React from 'react';

import Section from '@/components/Section';
import VariablesInput from '@/components/VariablesInput';
import { FormControl } from '@/pages/Canvas/components/Editor';

interface SplashEditorProps {
  title: string;
  onChange: (data: { title?: string; imageURL?: string }) => void;
  imageURL: string;
}

const SplashEditor: React.FC<SplashEditorProps> = ({ title, onChange, imageURL }) => (
  <Section isDividerNested>
    <FormControl label="Text Header or Variable">
      <VariablesInput value={title} onBlur={({ text }) => onChange({ title: text })} placeholder="Enter header here" />
    </FormControl>

    <FormControl label="Background Image" contentBottomUnits={0}>
      <Upload.FullImage update={(src) => onChange({ imageURL: src ?? '' })} image={imageURL} renderInput={VariablesInput.renderInput} />
    </FormControl>
  </Section>
);

export default SplashEditor;
