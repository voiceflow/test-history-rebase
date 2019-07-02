import cn from 'classnames';
import React from 'react';

function SpeechBar(props) {
  const { listening, listenClick, finalTranscript, interimTranscript } = props;

  let text;
  if (!listening) {
    text = 'Hold the Microphone or Spacebar for Voice Input';
  } else if (listening) {
    if (finalTranscript || interimTranscript) {
      text = (
        <span className="text-white">
          {finalTranscript} <span className="text-danger">{interimTranscript}</span>
        </span>
      );
    } else {
      text = 'Say Something';
    }
  }

  return (
    <div id="SpeechBar">
      <div className="speech-icon" onMouseDown={listenClick}>
        <i
          className={cn('fas fa-microphone', {
            'text-danger': listening,
            'text-dull': !listening,
          })}
        />
      </div>
      <div className="text-center flex-hard">{text}</div>
    </div>
  );
}

export default SpeechBar;
