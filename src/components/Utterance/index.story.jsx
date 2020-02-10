/* eslint-disable sonarjs/no-identical-functions */
import { action } from '@storybook/addon-actions';
import { boolean, object } from '@storybook/addon-knobs';
import { constants } from '@voiceflow/common';
import _sample from 'lodash/sample';
import React from 'react';

import Utterance from '.';

const { validSpokenCharacters } = constants.regex;

const SLOT_COLORS = ['#5D9DF5', '#F5A623', '#4E6FF9', '#E72D75', '#33E5BD', '#0F7EC0', '#8DA2B5', '#132144'];

const generateSlots = (length) => Array.from({ length }, (_, i) => ({ id: i, name: `slot${i}`, color: SLOT_COLORS[i % SLOT_COLORS.length] }));

const getProps = () => {
  const slots = object('slots', generateSlots(5));
  const [value, setValue] = React.useState('');

  return {
    slots,
    value,
    onChange: setValue,
    onAddSlot: action('add slot'),
    space: boolean('space', true),
    error: boolean('error', false),
  };
};

const getSlotProps = () => {
  const { slots, ...props } = getProps();
  const [newSlots, setSlots] = React.useState([]);
  const memoisedSlots = React.useMemo(() => [...slots, ...newSlots], [slots, newSlots]);

  const onAddSlot = (slotName) =>
    new Promise((resolve) => {
      setTimeout(() => {
        const newSlot = { id: Math.random(), name: slotName, color: _sample(SLOT_COLORS) };
        setSlots([...newSlots, newSlot]);
        resolve(newSlot);
      }, (Math.random() * 1000) / 3);
    });

  return {
    ...props,
    slots: memoisedSlots,
    onAddSlot,
    onBlur: ({ text }) => props.onChange(text),
  };
};

export default {
  title: 'Utterance',
  component: Utterance,
  includeStories: [],
};

export const empty = () => {
  const { slots, ...props } = getProps();

  return (
    <div style={{ width: '300px' }}>
      <Utterance {...props} />
    </div>
  );
};

export const withSlots = () => (
  <div style={{ width: '300px' }}>
    <Utterance {...getProps()} />
  </div>
);

export const withAddSlot = () => (
  <div style={{ width: '300px' }}>
    <Utterance {...getSlotProps()} />
  </div>
);

export const withIcon = () => (
  <div style={{ width: '300px' }}>
    <Utterance icon="user" {...getSlotProps()} iconProps={{ color: '#5d9df5' }} />
  </div>
);

export const internationalJapanese = () => {
  const [value, setValue] = React.useState(['運そク紙意ハヨセ想喜ノトタウ在国ゆ']);

  return (
    <div style={{ width: '300px' }}>
      <Utterance {...getSlotProps()} value={value} onChange={setValue} characters={validSpokenCharacters} />
    </div>
  );
};

export const internationalHindi = () => {
  const [value, setValue] = React.useState(['समाज विभाग हुएआदि निर्देश तरीके तकनिकल']);

  return (
    <div style={{ width: '300px' }}>
      <Utterance {...getSlotProps()} value={value} onChange={setValue} characters={validSpokenCharacters} />
    </div>
  );
};

export const performance = () => {
  const slots = object('slots', generateSlots(100));
  const values = object(
    'values',
    Array(100)
      .fill()
      .map(() => {
        const section = () => {
          const slot = _sample(slots);
          return `some text here {{[${slot.name}].${slot.id}}}`;
        };

        return Array(5)
          .fill()
          .reduce((acc) => acc + section(), '');
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
            <Utterance value={values[index]} slots={memoisedSlots} onChange={action('onChange')} onAddSlot={addNewSlot} />
          </div>
        ))}
      </div>
    </>
  );
};
