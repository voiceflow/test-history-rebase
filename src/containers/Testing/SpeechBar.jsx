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
    text = 'Hold Spacebar or the Microphone Icon for Voice Input';
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
      text = 'Say Something...';
    }
  }

  return (
    <div
      id="SpeechBar"
      className={cn('pointer', {
        listening,
        microphone,
      })}
      onMouseDown={listenClick}
    >
      <div className="speech-icon">
        <i className="fas fa-microphone" />
      </div>
      <div className="text-center flex-hard">{text}</div>
    </div>
  );
}

export default SpeechBar;
