import cn from 'classnames';
import React from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';

class SpeakBox extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {
      shouldRender: false,
      renderTime: '00:00',
    };
  }

  componentDidMount() {
    const { delay, audio } = this.props;
    this.timer = setTimeout(() => {
      this.centerNode();
      // if (isLast) this.props.resetTest()
      if (audio) audio.play();
      if (this.props.isFlow) {
        this.props.enterFlow(this.props.diagram, false);
      }
      this.setState({
        shouldRender: true,
        renderTime: this.props.time,
      });
      clearTimeout(this.timer);
    }, delay);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (this.props.lastNode) {
      this.props.lastNode.setFocused(false);
      this.props.lastNode.setSelected(false);
    }
  }

  centerNode = () => {
    const { diagramEngine, lastNode, setLastNode, node } = this.props;
    const model = diagramEngine.getDiagramModel();
    const nodeModel = model.getNode(node);
    if (nodeModel) {
      if (lastNode) {
        lastNode.setSelected(false);
        lastNode.setFocused(false);
      }
      setLastNode(nodeModel);
      nodeModel.setSelected(true);
      nodeModel.setFocused(true);
      model.setZoomLevel(80);
      model.setOffset(300 - nodeModel.x * 0.8, 300 - nodeModel.y * 0.8, true, diagramEngine);
    }
  };

  render() {
    const { text, type, isLeft, isRight, chat } = this.props;
    const { shouldRender, renderTime } = this.state;
    return (
      <>
        {shouldRender && (
          <div
            className={cn('mt-2 position-relative', {
              'text-left': isLeft,
              'text-right': isRight,
            })}
          >
            {this.props.isChoice && (
              <>
                <div className="choice-options p-2 align-self-start">
                  {chat.options.map((option, i) => (
                    <div
                      key={i}
                      className="choice-option mb-1"
                      onClick={(e) => {
                        this.props.inputSubmit(e, option);
                      }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </>
            )}
            {this.props.isSpeak && (
              <>
                <img src={type === 'audio' ? '/audio.svg' : '/alexa.svg'} height={18} width={18} alt="alexa" className="speak-box-icon mr-2" />
                <Tooltip title={renderTime}>
                  <div
                    className={cn('message border rounded p-2 align-self-start', {
                      'ml-4': isLeft,
                      'mr-4': isRight,
                    })}
                    onClick={() => {
                      this.props.audio.play();
                      this.centerNode();
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
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  skillId: state.skills.skill.skill_id,
});
export default connect(mapStateToProps)(SpeakBox);
