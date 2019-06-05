import React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import {Tooltip} from 'react-tippy'

class SpeakBox extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            shouldRender: false,
            renderTime: '00:00'
        }
    }
    componentDidMount() {
        const { delay, audio } = this.props;
        this.timer = setTimeout(() => {
            this.centerNode();
            if (audio) audio.play();
            if (this.props.isFlow) {
                this.props.enterFlow(this.props.diagram, false)
            }
            this.setState({
                shouldRender: true,
                renderTime: this.props.time
            })
        }, delay) 
    }

    componentWillUnmount() {
        clearTimeout(this.timer)
    }

    centerNode = () => {
        const {
            diagramEngine,
            node
        } = this.props;
        const model = diagramEngine.getDiagramModel()
        const nodeModel = model.getNode(node)
        if (nodeModel) {
         model.setZoomLevel(80)
         model.setOffset((300) - (nodeModel.x * 0.8), (300) - (nodeModel.y * 0.8))
        }
    }

    render() {
        const { text, type , isLeft, isRight, chat} = this.props;
        const { shouldRender, renderTime } = this.state
        return (
            <>
                {shouldRender &&
                   <div className={cn("mt-2 position-relative", {
                       'text-left': isLeft,
                       'text-right': isRight,
                   })}>
                   {this.props.isChoice &&
                   <>
                   <div className="choice-options p-2 align-self-start">
                        {chat.options.map((option, i) => <div key={i} className="choice-option mb-1" onClick={(e) => {
                            this.props.inputSubmit(e, option)
                        }}>
                            {option}
                        </div>
                        )}
                    </div>
                   </>    
                   }
                   {
                       this.props.isSpeak &&
                       <>
                       <img src={type === 'audio'? '/audio.svg' :'/alexa.svg'} height={15} width={15} alt="alexa" className="mr-2"/>
                        <Tooltip
                            title = {renderTime}
                        >
                                <div className = "message border rounded p-2 align-self-start"
                                onClick = {
                                    () => this.centerNode()
                                } >
                                    <p className="mb-0 px-1 text-left">{text}<br/></p>
                                </div>
                            </Tooltip>
                       </>
                   }
                    </div> 
                }
            </>
        )
    }
}

const mapStateToProps = state => ({
    skillId: state.skills.skill.skill_id,
})
export default connect(mapStateToProps)(SpeakBox)