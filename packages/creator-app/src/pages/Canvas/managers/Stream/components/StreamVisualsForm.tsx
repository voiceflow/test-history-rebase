import * as Realtime from '@voiceflow/realtime-sdk';
import { IconVariant, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { SectionToggleVariant } from '@/components/Section';
import FullImageUpload, { validateLink } from '@/components/Upload/ImageUpload/FullImage';
import ImageGroupUpload from '@/components/Upload/ImageUpload/ImageGroup';
import VariablesInput from '@/components/VariablesInput';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';

const VariablesInputAny = VariablesInput as any;

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
      prefix={<SvgIcon variant={IconVariant.STANDARD} icon="blocks" />}
      collapseVariant={SectionToggleVariant.ARROW}
      status={<>{isAdded ? 'Added' : 'Not Added'}</>}
    >
      <FormControl label="Title">
        <VariablesInputAny placeholder="Stream title" onBlur={updateTitle} value={data.title} />
      </FormControl>

      <FormControl label="Description">
        <VariablesInputAny placeholder="Stream description" onBlur={updateDescription} value={data.description} />
      </FormControl>

      <FormControl label="Icon">
        <ImageGroupUpload image={data.iconImage} update={updateIconImage} withVariables onValidateLink={validateLink} />
      </FormControl>

      <FormControl label="Background Image">
        <FullImageUpload image={data.backgroundImage} update={updateBackgroundImage} />
      </FormControl>
    </EditorSection>
  );
};

export default StreamVisualsForm;
