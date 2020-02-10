import React from 'react';

import FullImage from '@/componentsV2/Upload/ImageUpload/FullImage';
import VariablesInput from '@/componentsV2/VariablesInput';
import { FormControl } from '@/pages/Canvas/components/Editor';
import { FadeLeftContainer } from '@/styles/animations';

function CardForm({ data, onChange, withImage }) {
  const updateSmallImage = React.useCallback((smallImage) => onChange({ smallImage, hasSmallImage: true }), [onChange]);
  const updateLargeImage = React.useCallback((largeImage) => onChange({ largeImage }), [onChange]);
  const updateTitle = React.useCallback(({ text }) => onChange({ title: text }), [onChange]);
  const updateContent = React.useCallback(({ text }) => onChange({ content: text }), [onChange]);

  return (
    <>
      <FormControl label="Title">
        <VariablesInput value={data.title} onBlur={updateTitle} placeholder="Welcome to My Project!" />
      </FormControl>

      <FormControl label="Card Text">
        <VariablesInput value={data.content} onBlur={updateContent} multiline placeholder="Thanks for signing up, let's begin!" />
      </FormControl>

      {withImage && (
        <FadeLeftContainer>
          <FormControl label="Background Image">
            <FullImage image={data.largeImage} update={updateLargeImage} />
          </FormControl>
          {data.hasSmallImage && (
            <FormControl label="Small Screen Image">
              <FullImage image={data.smallImage} update={updateSmallImage} />
            </FormControl>
          )}
        </FadeLeftContainer>
      )}
    </>
  );
}

export default CardForm;
