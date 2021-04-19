import { composeDecorators, withDnD, withRedux } from '_storybook';
import { action } from '@storybook/addon-actions';
import React from 'react';

import { DialogType, PlatformType } from '@/constants';
import { styled } from '@/hocs';
import { SpeakData, SSMLData } from '@/models';

import SpeakAndAudioList from '.';

const withDecorators = composeDecorators(withDnD, withRedux());

const StyledContainer = styled.div`
  border: 2px solid red;
  background-color: #3e3e3e;
  color: white;
  padding: 4px;
`;

type MockItemProps = {
  item: SpeakData;
};

const isSSML = (item: SpeakData): item is SSMLData => item.type === DialogType.VOICE;

const MockItem = ({ item }: MockItemProps) => {
  const { type } = item;

  return (
    <StyledContainer>
      <div>type: {type}</div>
      {isSSML(item) ? (
        <>
          <div>voice: {item.voice || 'null'}</div>
          <div>content: {item.content || 'null'}</div>
        </>
      ) : (
        <div>url: {item.url || 'null'}</div>
      )}
    </StyledContainer>
  );
};

const speakItems: SpeakData[] = [
  {
    type: DialogType.VOICE,
    voice: 'Alexa',
    content: 'Hello, world!',
  },
  {
    type: DialogType.AUDIO,
    url: 'Final Breath [A-One]',
  },
];

export const basic = withDecorators(() => (
  <SpeakAndAudioList
    platform={PlatformType.ALEXA}
    changeRandomize={action('changed randomize')}
    changeSpeakItems={action('changed speak items')}
    itemComponent={MockItem}
    maxItems={5}
    speakItems={speakItems}
    randomize={false}
  />
));
