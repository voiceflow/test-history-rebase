import React from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';

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
        <img src={audioType === 'audio' ? '/audio.svg' : '/alexa.svg'} height={18} width={18} alt="alexa" className="speak-box-icon" />
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

const mapStateToProps = (state) => ({
  skillId: state.skills.skill.skill_id,
});

export default connect(mapStateToProps)(React.memo(SpeakBox));
