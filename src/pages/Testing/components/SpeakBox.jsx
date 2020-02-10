import React from 'react';
import { Tooltip } from 'react-tippy';

function getIcon(audioType) {
  switch (audioType) {
    case 'stream':
      return '/audio-player.svg';
    case 'audio':
      return '/audio.svg';
    default:
      return '/alexa.svg';
  }
}

function SpeakBox(props) {
  const { chat, playAudio, debug } = props;
  const { text, audioType } = chat;

  if ((debug && chat.debug) || chat.important) {
    return (
      <div className="message-container">
        <img src="/images/icons/power.svg" height={18} width={18} alt="alexa" className="speak-box-icon" />
        <div className="message align-self-start bg-light-turqoise">
          <p className="mb-0 px-1 text-left">
            {text}
            <br />
          </p>
        </div>
      </div>
    );
  }

  if (audioType) {
    return (
      <div className="message-container">
        <img src={getIcon(audioType)} height={18} width={18} alt={audioType} className="speak-box-icon" />
        <Tooltip title={chat.time} position="right">
          <button
            className="message align-self-start"
            onClick={() => {
              playAudio(chat.audio);
            }}
          >
            <p className="mb-0 px-1 text-left">
              {text}
              <br />
            </p>
          </button>
        </Tooltip>
      </div>
    );
  }

  return null;
}

export default React.memo(SpeakBox);
