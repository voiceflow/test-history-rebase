export default {
  name: 'Effects',
  children: [
    {
      name: 'Break',
      children: [
        {
          name: 'Short',
          children: [],
          data: {
            strength: 'medium',
          },
        },
        {
          name: 'Sentence',
          children: [],
          data: {
            strength: 'strong',
          },
        },
        {
          name: 'Paragraph',
          children: [],
          data: {
            strength: 'x-strong',
          },
        },
      ],
      prompt: {
        placeholder: 'Pause Duration',
        attribute: 'time',
      },
      data: {
        VF_tag: 'break',
        VF_type: 'BREAK',
        VF_void: true,
      },
    },
    {
      name: 'Volume',
      children: [
        {
          name: 'Silent',
          children: [],
          data: {
            volume: 'weak',
          },
        },
        {
          name: 'Very Soft',
          children: [],
          data: {
            volume: 'x-soft',
          },
        },
        {
          name: 'Soft',
          children: [],
          data: {
            volume: 'soft',
          },
        },
        {
          name: 'Medium',
          children: [],
          data: {
            volume: 'medium',
          },
        },
        {
          name: 'Loud',
          children: [],
          data: {
            volume: 'loud',
          },
        },
        {
          name: 'Very Loud',
          children: [],
          data: {
            volume: 'x-loud',
          },
        },
      ],
      data: {
        VF_tag: 'prosody',
        VF_type: 'VOLUME',
      },
    },
    {
      name: 'Speech Rate',
      children: [
        {
          name: 'Very Slow',
          children: [],
          data: {
            rate: 'x-slow',
          },
        },
        {
          name: 'Slow',
          children: [],
          data: {
            rate: 'slow',
          },
        },
        {
          name: 'Medium',
          children: [],
          data: {
            rate: 'medium',
          },
        },
        {
          name: 'Fast',
          children: [],
          data: {
            rate: 'fast',
          },
        },
        {
          name: 'Very Fast',
          children: [],
          data: {
            rate: 'x-fast',
          },
        },
      ],
      data: {
        VF_tag: 'prosody',
        VF_type: 'RATE',
      },
    },
    {
      name: 'Speech Tone (Pitch)',
      children: [
        {
          name: 'Very Low',
          children: [],
          data: {
            pitch: 'x-low',
          },
        },
        {
          name: 'Low',
          children: [],
          data: {
            pitch: 'low',
          },
        },
        {
          name: 'Medium',
          children: [],
          data: {
            pitch: 'medium',
          },
        },
        {
          name: 'High',
          children: [],
          data: {
            pitch: 'high',
          },
        },
        {
          name: 'Very High',
          children: [],
          data: {
            pitch: 'x-high',
          },
        },
      ],
      data: {
        VF_tag: 'prosody',
        VF_type: 'PITCH',
      },
    },
    {
      name: 'Emphasis',
      children: [
        {
          name: 'Strong',
          children: [],
          data: {
            level: 'strong',
          },
        },
        {
          name: 'Moderate',
          children: [],
          data: {
            level: 'moderate',
          },
        },
        {
          name: 'Reduced',
          children: [],
          data: {
            level: 'reduced',
          },
        },
      ],
      data: {
        VF_tag: 'emphasis',
        VF_type: 'EMPHASIS',
      },
    },
    {
      name: 'Interpretation',
      children: [
        {
          name: 'Words',
          children: [
            {
              name: 'Characters',
              children: [],
              data: {
                'interpret-as': 'characters',
              },
            },
            {
              name: 'Verb',
              children: [],
              data: {
                VF_tag: 'w',
                role: 'amazon:VB',
              },
            },
            {
              name: 'Past Participle',
              children: [],
              data: {
                VF_tag: 'w',
                role: 'amazon:VBD',
              },
            },
            {
              name: 'Noun',
              children: [],
              data: {
                VF_tag: 'w',
                role: 'amazon:NN',
              },
            },
            {
              name: 'Non-default Sense',
              children: [],
              data: {
                VF_tag: 'w',
                role: 'amazon:SENSE_1',
              },
            },
          ],
          data: {},
        },
        {
          name: 'Numbers',
          children: [
            {
              name: 'Number',
              children: [],
              data: {
                'interpret-as': 'cardinal',
              },
            },
            {
              name: 'Ordinal',
              children: [],
              data: {
                'interpret-as': 'ordinal',
              },
            },
            {
              name: 'Digits',
              children: [],
              data: {
                'interpret-as': 'digits',
              },
            },
            {
              name: 'Fraction',
              children: [],
              data: {
                'interpret-as': 'fraction',
              },
            },
            {
              name: 'Unit',
              children: [],
              data: {
                'interpret-as': 'unit',
              },
            },
          ],
          data: {},
        },
        {
          name: 'Date and Time',
          children: [
            {
              name: 'Time',
              children: [],
              data: {
                'interpret-as': 'time',
              },
            },
            {
              name: 'Month-Day-Year',
              children: [],
              data: {
                format: 'mdy',
              },
            },
            {
              name: 'Day-Month-Year',
              children: [],
              data: {
                format: 'dmy',
              },
            },
            {
              name: 'Year-Month-Day',
              children: [],
              data: {
                format: 'ymd',
              },
            },
            {
              name: 'Month-Day',
              children: [],
              data: {
                format: 'md',
              },
            },
            {
              name: 'Day-Month',
              children: [],
              data: {
                format: 'dm',
              },
            },
            {
              name: 'Year-Month',
              children: [],
              data: {
                format: 'ym',
              },
            },
            {
              name: 'Month-Year',
              children: [],
              data: {
                format: 'my',
              },
            },
            {
              name: 'Day',
              children: [],
              data: {
                format: 'd',
              },
            },
            {
              name: 'Month',
              children: [],
              data: {
                format: 'm',
              },
            },
            {
              name: 'Year',
              children: [],
              data: {
                format: 'y',
              },
            },
          ],
          data: {
            'interpret-as': 'date',
          },
        },
        {
          name: 'Contacts',
          children: [
            {
              name: 'Telephone',
              children: [],
              data: {
                'interpret-as': 'telephone',
              },
            },
            {
              name: 'Address',
              children: [],
              data: {
                'interpret-as': 'address',
              },
            },
          ],
          data: {},
        },
        {
          name: 'Expressions',
          children: [
            {
              name: 'Interjection',
              children: [],
              data: {
                'interpret-as': 'interjection',
              },
            },
            {
              name: 'Expletive',
              children: [],
              data: {
                'interpret-as': 'expletive',
              },
            },
          ],
          data: {},
        },
      ],
      data: {
        VF_tag: 'say-as',
        VF_type: 'INTERPRETATION',
      },
    },
    {
      name: 'Phoneme',
      children: [
        {
          name: 'IPA',
          children: [],
          data: {
            alphabet: 'ipa',
          },
          prompt: {
            placeholder: 'Pronunciation',
            attribute: 'ph',
          },
        },
        {
          name: 'X-SAMPA',
          children: [],
          data: {
            alphabet: 'x-sampa',
          },
          prompt: {
            placeholder: 'Pronunciation',
            attribute: 'ph',
          },
        },
      ],
      data: {
        VF_tag: 'phoneme',
        VF_type: 'PHONEME',
      },
    },
    {
      name: 'Alias',
      children: [],
      prompt: {
        placeholder: 'Alias',
        target: 'alias',
      },
      data: {
        VF_tag: 'sub',
        VF_type: 'ALIAS',
      },
    },
    {
      name: 'Whisper',
      children: [],
      data: {
        VF_tag: 'amazon:effect',
        name: 'whispered',
        VF_type: 'WHISPER',
      },
    },
  ],
  data: {},
};
