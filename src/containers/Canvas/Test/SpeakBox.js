import cn from 'classnames';
import React from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import moment from 'moment';

class SpeakBox extends React.Component {
  timer = null;

  state = {
    shouldRender: false,
  };

  componentDidMount() {
    const { chat } = this.props;
    const { audio, delay } = chat;
    this.timer = setTimeout(() => {
      this.centerNode();
      if (audio) {
        audio.play();
      }
      if (chat.diagram) {
        this.props.enterFlow(chat.diagram, false);
      }
      this.setState({
        shouldRender: true,
      });
    }, delay);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (this.lastNode) {
      this.lastNode.setFocused(false);
      this.lastNode.setSelected(false);
    }
  }

  centerNode = () => {
    const { diagramEngine, node } = this.props;
    const model = diagramEngine.getDiagramModel();
    const nodeModel = model.getNode(node);
    if (nodeModel) {
      if (this.lastNode) {
        lastNode.setSelected(false);
        lastNode.setFocused(false);
      }
      this.lastNode = nodeModel;
      nodeModel.setSelected(true);
      nodeModel.setFocused(true);
      model.setZoomLevel(80);
      model.setOffset(300 - nodeModel.x * 0.8, 300 - nodeModel.y * 0.8, true, diagramEngine);
    }
  };

  onPlayAudio = () => {
    this.props.chat.audio.play();
    this.centerNode();
  };

  render() {
    const { chat, submit } = this.props;
    const { text, audioType } = chat;
    const { shouldRender } = this.state;
    if (!shouldRender) {
      return null;
    }
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
              <Tooltip title={chat.time}>
                <div
                  className={cn('message border rounded p-2 align-self-start', {
                    'ml-4': !!chat.text,
                    'mr-4': !!chat.options,
                    'bg-light-turqoise': !audioType,
                  })}
                  onClick={() => {
                    this.onPlayAudio();
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
          {!!chat.options && (
            <>
              <div className="choice-options p-2 align-self-start">
                {chat.options.map((option, i) => (
                  <div key={i} className="choice-option mb-1" onClick={() => submit(option)}>
                    {option && option.label ? option.label : option}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  skillId: state.skills.skill.skill_id,
});

export default connect(mapStateToProps)(React.memo(SpeakBox));
