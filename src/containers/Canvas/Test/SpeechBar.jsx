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
        <>
          <span className="text-white">{finalTranscript}</span> {interimTranscript}
        </>
      );
    } else {
      text = 'Say Something';
    }
  }

  return (
    <div id="SpeechBar">
      <button
        className={cn('speech-icon', {
          listening,
        })}
        onMouseDown={listenClick}
      >
        <i className="fas fa-microphone" />
      </button>
      <div className="text-center flex-hard">{text}</div>
    </div>
  );
}

export default SpeechBar;
