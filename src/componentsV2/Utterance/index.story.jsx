/* eslint-disable sonarjs/no-identical-functions */
import { action } from '@storybook/addon-actions';
import { boolean, object } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { constants } from '@voiceflow/common';
import _sample from 'lodash/sample';
import React from 'react';

import { Variant, createTestableStory } from '@/../.storybook';

import UtteranceInput from '.';

const SLOT_COLORS = ['#5D9DF5', '#F5A623', '#4E6FF9', '#E72D75', '#33E5BD', '#0F7EC0', '#8DA2B5', '#132144'];
const DEFAULT_SLOTS = (length) => Array.from({ length }, (_, i) => ({ id: i, name: `slot${i}`, color: SLOT_COLORS[i % SLOT_COLORS.length] }));

const { validSpokenCharacters } = constants.regex;

storiesOf('Utterance (DontTest)', module)
  .add(
    'variants',
    createTestableStory(() => {
      const slots = object('slots', DEFAULT_SLOTS(5));
      const space = boolean('space', true);
      const [newSlots, addSlot] = React.useState([]);
      const memoisedSlots = React.useMemo(() => [...slots, ...newSlots], [slots, newSlots]);

      const [value1, setValue1] = React.useState(null);
      const [value2, setValue2] = React.useState(null);
      const [value3, setValue3] = React.useState(null);

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
        <>
          <Variant label="empty">
            <div style={{ width: '300px' }}>
              <UtteranceInput space={space} value={value1} onChange={setValue1} onAddSlot={action('onAddSlot')} />
            </div>
          </Variant>

          <Variant label="with slots">
            <div style={{ width: '300px' }}>
              <UtteranceInput space={space} value={value2} slots={slots} onChange={setValue2} onAddSlot={action('onAddSlot')} />
            </div>
          </Variant>

          <Variant label="with add slot">
            <div style={{ width: '300px' }}>
              <UtteranceInput space={space} value={value3} slots={memoisedSlots} onChange={setValue3} onAddSlot={addNewSlot} />
            </div>
          </Variant>
        </>
      );
    })
  )
  .add(
    'international',
    createTestableStory(() => {
      const slots = object('slots', DEFAULT_SLOTS(5));

      const [newSlots, addSlot] = React.useState([]);
      const memoisedSlots = React.useMemo(() => [...slots, ...newSlots], [slots, newSlots]);

      const [value1, setValue1] = React.useState(['運そク紙意ハヨセ想喜ノトタウ在国ゆン']);
      const [value2, setValue2] = React.useState(['समाज विभाग हुएआदि निर्देश तरीके तकनिकल']);

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
        <>
          <Variant label="japanese with add slot">
            <div style={{ width: '300px' }}>
              <UtteranceInput value={value1} slots={memoisedSlots} onChange={setValue1} onAddSlot={addNewSlot} characters={validSpokenCharacters} />
            </div>
          </Variant>

          <Variant label="hindi with add slot">
            <div style={{ width: '300px' }}>
              <UtteranceInput value={value2} slots={memoisedSlots} onChange={setValue2} onAddSlot={addNewSlot} characters={validSpokenCharacters} />
            </div>
          </Variant>
        </>
      );
    })
  )
  .add(
    'performance',
    createTestableStory(() => {
      const slots = object('slots', DEFAULT_SLOTS(100));
      const values = object(
        'values',
        Array(100)
          .fill()
          .map(() => {
            const section = () => ['some text here ', _sample(slots), ' '];

            return Array(5)
              .fill()
              .reduce((acc) => [...acc, ...section()], []);
          })
      );

      const [newSlots, addSlot] = React.useState([]);
      const memoisedSlots = React.useMemo(() => [...slots, ...newSlots], [slots, newSlots]);

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
        <>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            {values.map((_, index) => (
              <div style={{ width: '300px', margin: '20px' }} key={index}>
                <UtteranceInput value={values[index]} slots={memoisedSlots} onChange={action('onChange')} onAddSlot={addNewSlot} />
              </div>
            ))}
          </div>
        </>
      );
    })
  );
