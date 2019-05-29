import React from 'react'
import {Tooltip} from 'react-tippy'
import moment from 'moment'

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
            audio.play();
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
         model.setZoomLevel(80)
         model.setOffset((300) - (nodeModel.x * 0.8), (300) - (nodeModel.y * 0.8))
    }

    render() {
        const { text, type , delay} = this.props;
        const { shouldRender, renderTime } = this.state
        return (
            <>
                {shouldRender &&
                   <div className="mt-2 text-left position-relative">
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
                    </div> 
                }
            </>
        )
    }
}

export default SpeakBox