import * as Realtime from '@voiceflow/realtime-sdk';
import { SvgIcon, Upload } from '@voiceflow/ui';
import React from 'react';

import { SectionToggleVariant } from '@/components/Section';
import VariablesInput from '@/components/VariablesInput';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';

interface StreamVisualsFormProps {
  data: Realtime.NodeData<Realtime.NodeData.Stream>;
  onChange: (data: Partial<Realtime.NodeData.Stream>) => void;
}

const StreamVisualsForm: React.FC<StreamVisualsFormProps> = ({ data, onChange }) => {
  const updateTitle = React.useCallback(({ text }: { text: string }) => onChange({ title: text }), [onChange]);
  const updateDescription = React.useCallback(({ text }: { text: string }) => onChange({ description: text }), [onChange]);
  const updateIconImage = React.useCallback((iconImage: string | null) => onChange({ iconImage }), [onChange]);
  const updateBackgroundImage = React.useCallback((backgroundImage: string | null) => onChange({ backgroundImage }), [onChange]);

  const isAdded = data.title || data.description || data.iconImage || data.backgroundImage;

  return (
    <EditorSection
      namespace="visuals"
      header="Visuals"
      headerToggle
      prefix={<SvgIcon variant={SvgIcon.Variant.STANDARD} icon="blocks" />}
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
        <Upload.ImageGroup image={data.iconImage} update={updateIconImage} renderInput={VariablesInput.renderInput} />
      </FormControl>

      <FormControl label="Background Image">
        <Upload.FullImage image={data.backgroundImage} update={updateBackgroundImage} renderInput={VariablesInput.renderInput} />
      </FormControl>
    </EditorSection>
  );
};

export default StreamVisualsForm;
