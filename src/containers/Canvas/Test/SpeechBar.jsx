import cn from 'classnames';
import React from 'react';

function SpeechBar(props) {
  const { listening, listenClick, finalTranscript, interimTranscript, browserSupport, microphone, ended } = props;

  if (!browserSupport) return null;
  if (ended) {
    return (
      <div id="SpeechBar">
        <div className="text-center flex-hard">Test Ended</div>
      </div>
    );
  }

  let text;
  if (!listening) {
    text = 'Hold the Microphone or Spacebar for Voice Input';
  } else if (!microphone) {
    text = <span className="text-white">Please enable Voiceflow access to the microphone</span>;
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
    <div
      id="SpeechBar"
      className={cn({
        listening,
        microphone,
      })}
    >
      <button className="speech-icon" onMouseDown={listenClick}>
        <i className="fas fa-microphone" />
      </button>
      <div className="text-center flex-hard">{text}</div>
    </div>
  );
}

export default SpeechBar;
