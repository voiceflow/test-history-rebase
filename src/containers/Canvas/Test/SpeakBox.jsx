import React from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';

function SpeakBox(props) {
  const { chat, playAudio, debug } = props;
  const { text, audioType } = chat;

  if (debug && chat.debug) {
    return (
      <div className="mt-2 position-relative text-left">
        <img src="/images/icons/power.svg" height={18} width={18} alt="alexa" className="speak-box-icon mr-2" />
        <div className="message border rounded p-2 align-self-start ml-4 bg-light-turqoise">
          <p className="mb-0 px-1 text-left">
            {text}
            <br />
          </p>
        </div>
      </div>
    );
  }

  if (chat.options) {
    return (
      <div className="mt-2 position-relative text-right">
        <div className="message pointer border rounded p-2 align-self-start mr-4">
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
      <div className="mt-2 position-relative text-left">
        <img src={audioType === 'audio' ? '/audio.svg' : '/alexa.svg'} height={18} width={18} alt="alexa" className="speak-box-icon mr-2" />
        <Tooltip title={chat.time} position="right">
          <button
            className="message border rounded p-2 align-self-start ml-4"
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

const mapStateToProps = (state) => ({
  skillId: state.skills.skill.skill_id,
});

export default connect(mapStateToProps)(React.memo(SpeakBox));
