import React from 'react';

import Section from '@/components/Section';
import FullImage from '@/components/Upload/ImageUpload/FullImage';
import VariablesInput from '@/components/VariablesInput';
import { FormControl } from '@/pages/Canvas/components/Editor';

function SplashEditor({ splashHeader, onChange, backgroundImage }) {
  const onBlur = (value) => {
    onChange({ splashHeader: value.text });
  };

  return (
    <Section isDividerNested>
      <FormControl label="Text Header or Variable">
        <VariablesInput value={splashHeader} onBlur={onBlur} placeholder="Enter header here" />
      </FormControl>

      <FormControl label="Background Image" contentBottomUnits={0}>
        <FullImage update={(val) => onChange({ backgroundImage: val })} image={backgroundImage} />
      </FormControl>
    </Section>
  );
}

export default SplashEditor;
