import React, { Component } from 'react'
import AudioDrop from '../../../components/Uploads/AudioDrop'
import Switch from '@material-ui/core/Switch'

class Stream extends Component {
    constructor(props) {
        super(props)

        this.state = {
            node: props.node
        }

        this.togglePause = this.togglePause.bind(this)
        this.toggleLoop = this.toggleLoop.bind(this)
    }

    onUpdate(){
        this.forceUpdate();
        this.props.onUpdate();
    }

    toggleLoop(){
        let node = this.state.node;
        node.extras.loop = !node.extras.loop;
        this.onUpdate()
    }

    togglePause(){
        let node = this.state.node;
        let ports = node.getPorts();

        if(this.state.node.extras.custom_pause){
            for (let name in ports) {
                let port = node.getPort(name);
                if(port.in) continue

                if (port.label === 'pause') {
                    node.removePort(port)
                }
            }
        }else{
            this.state.node.addOutPort('pause').setMaximumLinks(1)
        }

        node.extras.custom_pause = !node.extras.custom_pause

        this.props.repaint()
        this.onUpdate()
    }

    render() {
        return (
            <div>
                <label>Stream File (AAC/MP4, MP3, HLS)</label>
                <AudioDrop
                    audio={this.state.node.extras.audio}
                    update={(audio)=>{
                        let node = this.state.node;
                        node.extras.audio = audio;
                        this.onUpdate();
                    }}
                    stream
                />
                <div className="space-between mt-3">
                    <label>Custom Pause</label>
                    <Switch
                        checked={!!this.state.node.extras.custom_pause}
                        onChange={this.togglePause}
                        color="primary"
                        className="fulfill-switch"
                    />
                </div>
                <div className="space-between">
                    <label>Loop Audio</label>
                    <Switch
                        checked={!!this.state.node.extras.loop}
                        onChange={this.toggleLoop}
                        color="primary"
                        className="fulfill-switch"
                    />
                </div>
            </div>
        );
    }
}

export default Stream;
