import cn from 'classnames';
import React from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';

function SpeakBox(props) {
  const { chat, playAudio, debug } = props;
  const { text, audioType } = chat;

  if (!debug && !audioType) return null;

  return (
    <>
      <div
        className={cn('mt-2 position-relative', {
          'text-left': !!chat.text,
          'text-right': !!chat.options,
        })}
      >
        {!!chat.text && (
          <>
            {audioType ? (
              <img src={audioType === 'audio' ? '/audio.svg' : '/alexa.svg'} height={18} width={18} alt="alexa" className="speak-box-icon mr-2" />
            ) : (
              <img src="/images/icons/power.svg" height={18} width={18} alt="alexa" className="speak-box-icon mr-2" />
            )}
            <Tooltip title={chat.time} position="right">
              <div
                className={cn('message pointer border rounded p-2 align-self-start', {
                  'ml-4': !!chat.text,
                  'mr-4': !!chat.options,
                  'bg-light-turqoise': !audioType,
                })}
                onClick={() => {
                  playAudio(chat.audio);
                }}
              >
                <p className="mb-0 px-1 text-left">
                  {text}
                  <br />
                </p>
              </div>
            </Tooltip>
          </>
        )}
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  skillId: state.skills.skill.skill_id,
});

export default connect(mapStateToProps)(React.memo(SpeakBox));
