/* eslint-disable sonarjs/no-identical-functions */
import { boolean, object } from '@storybook/addon-knobs';
import _sample from 'lodash/sample';
import React from 'react';

import { ToastContainer } from '@/componentsV2/Toast';

import SSML, { VOICES } from '.';

const SLOT_COLORS = ['#5D9DF5', '#F5A623', '#4E6FF9', '#E72D75', '#33E5BD', '#0F7EC0', '#8DA2B5', '#132144'];
const DEFAULT_SLOTS = (length) => Array.from({ length }, (_, i) => ({ id: i, name: `slot${i}`, color: SLOT_COLORS[i % SLOT_COLORS.length] }));

const DEFAULT_VALUE = `
<speak>
  Here are <say-as interpret-as="characters">SSML</say-as> samples.
  I can pause <break time="3s" />.
  I can play a sound {{[slot2].2}}
  <audio src="https://www.example.com/MY_MP3_FILE.mp3">
    didn't get your MP3 audio file
  </audio>.
  I can speak in cardinals.
  Or I can even speak in digits. The digits for ten are
  <say-as interpret-as="characters">
    {{[slot3].3}}
    <s>{{[slot1].1}}</s>
  </say-as>.
  I can also substitute phrases, like the
  <sub alias="World Wide Web Consortium">
    W3C
  </sub>.
  Finally, I can speak a paragraph with two sentences.
  <p>
    <s>{{[slot1].1}}</s>
    <s>This is sentence two.</s>
    <sa Or I can speak in ordinals. You are
    W3C   .   Finally, I can speak a paragraph with two sentences.   <p> <s>{{[slot1].1}}
  </p>
</speak>
`;

export default {
  title: 'SSML',
  component: SSML,
  includeStories: [],
};

export const normal = () => {
  const space = boolean('space', true);
  const error = boolean('error', false);
  const slots = object('slots', DEFAULT_SLOTS(5));
  const [voice, setVoice] = React.useState(VOICES[0].options[0].value);
  const [newSlots, addSlot] = React.useState([]);
  const memoisedSlots = React.useMemo(() => [...slots, ...newSlots], [slots, newSlots]);

  const [value, setValue] = React.useState(DEFAULT_VALUE);

  const addNewSlot = React.useCallback(
    (slotName) =>
      new Promise((resolve) => {
        setTimeout(() => {
          const newSlot = { id: Math.random(), name: slotName, color: _sample(SLOT_COLORS) };
          addSlot([...newSlots, newSlot]);
          resolve(newSlot);
        }, (Math.random() * 1000) / 3);
      })
  );

  return (
    <div style={{ width: '500px' }}>
      <SSML
        icon="alexa"
        voice={voice}
        space={space}
        value={value}
        error={error}
        onBlur={({ text }) => setValue(text)}
        variables={memoisedSlots}
        onAddVariable={addNewSlot}
        onChangeVoice={setVoice}
      />

      <ToastContainer />
    </div>
  );
};
