import { boolean, object } from '@storybook/addon-knobs';
import _sample from 'lodash/sample';
import React from 'react';

import { ToastContainer } from '@/components/Toast';
import { TextEditorVariablesPopoverProvider } from '@/contexts';

import TextEditor, { PluginType } from '.';

const SLOT_COLORS = ['#5D9DF5', '#F5A623', '#4E6FF9', '#E72D75', '#33E5BD', '#0F7EC0', '#8DA2B5', '#132144'];
const DEFAULT_VARIABLES = (length) => Array.from({ length }, (_, i) => ({ id: i, name: `slot${i}`, color: SLOT_COLORS[i % SLOT_COLORS.length] }));

const DEFAULT_TAGS = {
  break: {
    color: '#0F7EC0',
    isSingle: true,
    attributes: {
      time: {
        type: 'text',
        default: '',
        validate: (value) => ({
          valid: !!value.match(/^\d+(m?s)?$/),
          error: "you can use only numbers with 'ms' postfix",
        }),
        required: false,
        placeholder: '1s',
      },
      strength: {
        type: 'select',
        default: 'medium',
        options: ['x-weak', 'weak', 'medium', 'strong', 'x-strong'],
        required: true,
      },
    },
  },
  emphasis: {
    color: '#8DA2B5',
    attributes: {
      level: {
        type: 'select',
        options: ['strong', 'moderate', 'reduced'],
        default: 'strong',
        required: true,
      },
    },
  },
  p: {
    color: '#0F7EC0',
  },
  s: {
    color: '#0F7EC0',
  },
  speak: {
    color: '#5D9DF5',
  },
  sub: {
    color: '#C24689',
    attributes: {
      alias: {
        type: 'text',
        required: true,
        placeholder: 'Alias',
      },
    },
  },
  voice: {
    color: '#3E9840',
    attributes: {
      name: {
        type: 'select',
        options: ['Ivy', 'Joanna', 'Joey', 'Justin', 'Kendra', 'Kimberly', 'Matthew', 'Salli'],
        default: 'Kendra',
        required: true,
      },
    },
  },
  w: {
    color: '#C79839',
    attributes: {
      role: {
        type: 'select',
        options: ['amazon:VB', 'amazon:VBD', 'amazon:NN', 'amazon:SENSE_1'],
        default: 'amazon:SENSE_1',
        required: true,
      },
    },
  },
};

const ADD_OPTIONS = [
  {
    name: 'Break',
    options: [
      {
        tag: 'break',
        name: 'input',
        inputAttribute: 'time',
      },
      {
        tag: 'break',
        name: 'Short',
        attributes: {
          strength: 'medium',
        },
      },
      {
        tag: 'break',
        name: 'Sentence',
        attributes: {
          strength: 'strong',
        },
      },
      {
        tag: 'break',
        name: 'Paragraph',
        attributes: {
          strength: 'x-strong',
        },
      },
    ],
  },
  {
    name: 'Interpretation',
    options: [
      {
        name: 'Words',
        options: [
          {
            tag: 'w',
            name: 'Verb',
            attributes: {
              role: 'amazon:VB',
            },
          },
          {
            tag: 'w',
            name: 'Past Participle',
            attributes: {
              role: 'amazon:VBD',
            },
          },
          {
            tag: 'w',
            name: 'Noun',
            attributes: {
              role: 'amazon:NN',
            },
          },
          {
            tag: 'w',
            name: 'Non-default Sense',
            attributes: {
              role: 'amazon:SENSE_1',
            },
          },
        ],
      },
    ],
  },
  {
    name: 'Alias',
    options: [
      {
        tag: 'sub',
        name: 'Alias Input',
        inputAttribute: 'alias',
      },
    ],
  },
];

const DEFAULT_VALUE = `
<speak>
  Here are <say-as interpret-as="characters">SSML</say-as> samples.
  I can pause <break time="3s" />.
  I can play a sound {{[slot2].2}}
  <audio src="https://www.example.com/MY_MP3_FILE.mp3">
    didn't get your MP3 audio file
  </audio>.
  I can speak in cardinals. Your number is
  <say-as interpret-as="cardinal">
    10
  </say-as>.
  Or I can speak in ordinals. You are
  <say-as interpret-as="ordinal">
    10
  </say-as> in line.
  Or I can even speak in digits. The digits for ten are
  <say-as interpret-as="characters">
    {{[slot3].3}}
  </say-as>.
  I can also substitute phrases, like the
  <sub alias="World Wide Web Consortium">
    W3C
  </sub>.
  Finally, I can speak a paragraph with two sentences.
  <p>
    <s>{{[slot1].1}}</s>
    <s>This is sentence two.</s>
    <sa Or I can speak in ordinals. You are       W3C   .   Finally, I can speak a paragraph with two sentences.   <p> {{[slot1].1}}
  </p>
</speak>
`;

export default {
  title: 'TextEditor',
  component: TextEditor,
  includeStories: [],
};

const getProps = () => {
  const [value, setValue] = React.useState(DEFAULT_VALUE);

  return {
    value,
    error: boolean('error', false),
    onBlur: ({ text }) => setValue(text),
  };
};

const getXMLProps = () => ({
  icon: 'alexa',
  iconProps: { color: '#5d9df5' },
  pluginsTypes: [PluginType.XML],
  pluginsProps: {
    [PluginType.XML]: {
      type: 'ssml',
      tags: DEFAULT_TAGS,
      addLabel: 'Add Effect',
      addOptions: ADD_OPTIONS,
      historyTooltip: 'Recent Effects',
    },
  },
});

const getVariablesProps = () => {
  const variables = object('variables', DEFAULT_VARIABLES(5));
  const [newVariables, addVariable] = React.useState([]);
  const memoisedVariables = React.useMemo(() => [...variables, ...newVariables], [variables, newVariables]);

  const addNewVariable = (variableName) =>
    new Promise((resolve) => {
      setTimeout(() => {
        const newVariable = { id: Math.random(), name: variableName, color: _sample(SLOT_COLORS) };
        addVariable([...newVariables, newVariable]);
        resolve(newVariable);
      }, (Math.random() * 1000) / 3);
    });

  return {
    pluginsTypes: [PluginType.VARIABLES],
    pluginsProps: {
      [PluginType.VARIABLES]: {
        space: boolean('error', true),
        variables: memoisedVariables,
        creatable: true,
        onAddVariable: addNewVariable,
      },
    },
  };
};

const mergeProps = (...pluginsProps) =>
  pluginsProps.reduce(
    (obj, props) =>
      Object.assign(obj, props, {
        pluginsTypes: [...obj.pluginsTypes, ...(props.pluginsTypes || [])],
        pluginsProps: { ...obj.pluginsProps, ...props.pluginsProps },
      }),
    { pluginsTypes: [], pluginsProps: {} }
  );

const createStory = (...props) => (
  <TextEditorVariablesPopoverProvider value={document.body}>
    <div style={{ width: '500px' }}>
      <TextEditor {...mergeProps(...props)} />
      <ToastContainer />
    </div>
  </TextEditorVariablesPopoverProvider>
);

export const base = () => createStory(getProps());

export const xml = () => createStory(getProps(), getXMLProps());

export const variables = () => createStory(getProps(), getVariablesProps());

export const all = () => createStory(getProps(), getXMLProps(), getVariablesProps());
