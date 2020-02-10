import React from 'react';

import { SectionToggleVariant } from '@/components/Section';
import SvgIcon from '@/components/SvgIcon';
import FullImageUpload from '@/components/Upload/ImageUpload/FullImage';
import ImageGroupUpload from '@/components/Upload/ImageUpload/ImageGroup';
import VariablesInput from '@/components/VariablesInput';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';

function StreamVisualsForm({ data, onChange }) {
  const updateTitle = React.useCallback(({ text }) => onChange({ title: text }), [onChange]);
  const updateDescription = React.useCallback(({ text }) => onChange({ description: text }), [onChange]);
  const updateIconImage = React.useCallback((iconImage) => onChange({ iconImage }), [onChange]);
  const updateBackgroundImage = React.useCallback((backgroundImage) => onChange({ backgroundImage }), [onChange]);

  const isAdded = data.title || data.description || data.iconImage || data.backgroundImage;

  return (
    <EditorSection
      namespace="visuals"
      header="Visuals"
      headerToggle
      prefix={<SvgIcon variant="standard" icon="blocks" />}
      collapseVariant={SectionToggleVariant.ARROW}
      status={<>{isAdded ? 'Added' : 'Not Added'}</>}
    >
      <FormControl label="Title">
        <VariablesInput placeholder="Stream title" onBlur={updateTitle} value={data.title} />
      </FormControl>
      <FormControl label="Description">
        <VariablesInput placeholder="Stream description" onBlur={updateDescription} value={data.description} />
      </FormControl>
      <FormControl label="Icon">
        <ImageGroupUpload image={data.iconImage} update={updateIconImage} />
      </FormControl>
      <FormControl label="Background Image">
        <FullImageUpload image={data.backgroundImage} update={updateBackgroundImage} />
      </FormControl>
    </EditorSection>
  );
}

export default StreamVisualsForm;
