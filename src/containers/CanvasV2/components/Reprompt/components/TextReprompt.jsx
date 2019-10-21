import { constants } from '@voiceflow/common';
import React from 'react';

import Select from '@/components/Select';
import TextArea from '@/componentsV2/TextArea';
import Header from '@/containers/CanvasV2/managers/Speak/components/SpeakElementHeader';

const VOICES = constants.voices;
const DEFAULT_VOICE = 'Alexa';
const TEXTAREA_PLACEHOLDER = "Sorry I didn't get that! Do you like this or that?";

function TextReprompt({ data, onChange }) {
  const { voice, content } = data.reprompt;

  const updateContent = (e) => {
    onChange({ reprompt: { ...data.reprompt, content: e.target.value } });
  };
  return (
    <div>
      <Header>
        <div>Speaking as</div>
        <Select
          className="speak-box"
          value={{ label: voice || DEFAULT_VOICE, value: voice || DEFAULT_VOICE }}
          onChange={(selected) => {
            onChange({ reprompt: { ...data.reprompt, voice: selected.value } });
          }}
          options={VOICES}
          fullWidth
        />
      </Header>
      <TextArea placeholder={TEXTAREA_PLACEHOLDER} value={content} onChange={updateContent} />
    </div>
  );
}

export default TextReprompt;
