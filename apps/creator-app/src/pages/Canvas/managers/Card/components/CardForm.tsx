import type * as Realtime from '@voiceflow/realtime-sdk';
import { Animations, Upload } from '@voiceflow/ui';
import React from 'react';

import VariablesInput from '@/components/VariablesInput';
import { FormControl } from '@/pages/Canvas/components/Editor';

interface CardFormProps {
  data: Realtime.NodeData<Realtime.NodeData.Card>;
  onChange: (data: Partial<Realtime.NodeData.Card>) => void;
  withImage?: boolean;
}

const CardForm: React.FC<CardFormProps> = ({ data, onChange, withImage }) => {
  const updateSmallImage = React.useCallback(
    (smallImage: string | null) => onChange({ smallImage, hasSmallImage: true }),
    [onChange]
  );
  const updateLargeImage = React.useCallback((largeImage: string | null) => onChange({ largeImage }), [onChange]);
  const updateTitle = React.useCallback(({ text }: { text: string }) => onChange({ title: text }), [onChange]);
  const updateContent = React.useCallback(({ text }: { text: string }) => onChange({ content: text }), [onChange]);

  return (
    <>
      <FormControl label="Title">
        <VariablesInput value={data.title} onBlur={updateTitle} placeholder="Welcome to My Assistant!" />
      </FormControl>

      <FormControl label="Card Text" contentBottomUnits={!withImage ? 0 : undefined}>
        <VariablesInput
          value={data.content}
          onBlur={updateContent}
          multiline
          placeholder="Thanks for signing up, let's begin!"
          newLineOnEnter
        />
      </FormControl>

      {withImage && (
        <Animations.FadeLeft>
          <FormControl label="Background Image" contentBottomUnits={!data.hasSmallImage ? 0 : undefined}>
            <Upload.FullImage
              image={data.largeImage}
              update={updateLargeImage}
              renderInput={VariablesInput.renderInput}
            />
          </FormControl>
          {data.hasSmallImage && (
            <FormControl label="Small Screen Image" contentBottomUnits={0}>
              <Upload.FullImage
                image={data.smallImage}
                update={updateSmallImage}
                renderInput={VariablesInput.renderInput}
              />
            </FormControl>
          )}
        </Animations.FadeLeft>
      )}
    </>
  );
};

export default CardForm;
