import React, { Component } from 'react'
import AudioDrop from '../../../components/Uploads/AudioDrop'
import Toggle from 'react-toggle'
import _ from 'lodash'

class Stream extends Component {
    constructor(props) {
        super(props)

        this.state = {
            node: props.node
        }

        this.togglePause = this.togglePause.bind(this)
        this.toggleLoop = this.toggleLoop.bind(this)
    }
    static getDerivedStateFromProps(props){
        return {
            node: props.node
        }
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
            let bestNode
            if (node.parentCombine){
                bestNode = _.findIndex(node.parentCombine.combines, npc => npc.name === node.name)
            }
            for (let name in ports) {
                let port = node.getPort(name);
                if(port.in) continue

                if (port.label === 'pause') {
                    node.removePort(port)
                    if (node.parentCombine) {
                        let bestNode = _.findIndex(node.parentCombine.combines, npc => npc.id === node.id)
                        node.parentCombine.combines[bestNode] = node
                    }
                }
            }
        }else{
            this.state.node.addOutPort('pause').setMaximumLinks(1)
            node = this.state.node
            if (node.parentCombine) {
                let bestNode = _.findIndex(node.parentCombine.combines, npc => npc.id === node.id)
                node.parentCombine.combines[bestNode] = node
            }
        }
        node.extras.custom_pause = !node.extras.custom_pause
        this.setState({
            node: node
        }, this.props.onUpdate);
        // this.props.diagramEngine.setSuperSelect(node.parentCombine);
        this.props.repaint();
        this.forceUpdate()
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
                    <Toggle
                        icons={false}
                        checked={!!this.state.node.extras.custom_pause}
                        onChange={this.togglePause}
                        className="fulfill-switch"
                    />
                </div>
                <div className="space-between">
                    <label>Loop Audio</label>
                    <Toggle
                        icons={false}
                        checked={!!this.state.node.extras.loop}
                        onChange={this.toggleLoop}
                        className="fulfill-switch"
                    />
                </div>
            </div>
        );
    }
}

export default Stream;
