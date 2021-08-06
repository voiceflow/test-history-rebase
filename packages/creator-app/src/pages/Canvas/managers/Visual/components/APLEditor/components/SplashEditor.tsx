import React from 'react';

import Section from '@/components/Section';
import FullImage from '@/components/Upload/ImageUpload/FullImage';
import VariablesInput from '@/components/VariablesInput';
import { FormControl } from '@/pages/Canvas/components/Editor';

const AnyFullImage = FullImage as any;
const AnyVariablesInput = VariablesInput as any;

interface SplashEditorProps {
  title: string;
  onChange: (data: { title?: string; imageURL?: string }) => void;
  imageURL: string;
}

const SplashEditor: React.FC<SplashEditorProps> = ({ title, onChange, imageURL }) => (
  <Section isDividerNested>
    <FormControl label="Text Header or Variable">
      <AnyVariablesInput value={title} onBlur={({ text }: { text: string }) => onChange({ title: text })} placeholder="Enter header here" />
    </FormControl>

    <FormControl label="Background Image" contentBottomUnits={0}>
      <AnyFullImage update={(src: string) => onChange({ imageURL: src })} image={imageURL} />
    </FormControl>
  </Section>
);

export default SplashEditor;
