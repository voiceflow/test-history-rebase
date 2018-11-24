import React, { Component } from 'react';
import { Input, InputGroup } from 'reactstrap';
import AudioDrop from './components/AudioDrop';

const outputs = ['next', 'previous'];

class Stream extends Component {
    constructor(props) {
        super(props);

        this.state = {
            node: props.node
        };
        // this.state.node.extras.audio = "https://s3.amazonaws.com/com.getstoryflow.audio.production/1542483841536-all-star---smash-mouth-lyrics.mp3";

        this.togglePlayer = this.togglePlayer.bind(this);
        this.toggleLoop = this.toggleLoop.bind(this);
    }

    onUpdate(){
        this.forceUpdate();
        this.props.onUpdate();
    }

    toggleLoop(){
        let node = this.state.node;
        node.extras.loop = !node.extras.loop;

        this.onUpdate();
    }

    togglePlayer(){
        let node = this.state.node;
        let ports = node.getPorts();

        if(this.state.node.extras.player === true){
            for (let name in ports) {
                let port = node.getPort(name);
                if(port.in) continue;

                if (outputs.includes(port.label)) {
                    node.removePort(port);
                }
            }
        }else{
            if(Object.keys(ports).length === 2){
                outputs.forEach(out => {
                    node.addOutPort(out).setMaximumLinks(1);
                });
            }
        }

        node.extras.player = !node.extras.player;

        this.props.repaint();
        this.onUpdate();
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
                <InputGroup className="mt-3">
                    <label className="input-group-text w-100 m-0 text-left">
                        <Input addon type="checkbox" checked={!!this.state.node.extras.loop} onChange={this.toggleLoop}/>
                        <span className="ml-2">Loop Audio {this.state.node.extras.player ? ' By Default' : ''}</span>
                    </label>
                </InputGroup>
                <InputGroup className="mb-1 mt-2">
                    <label className="input-group-text w-100 m-0 text-left">
                        <Input addon type="checkbox" checked={!!this.state.node.extras.player} onChange={this.togglePlayer}/>
                        <span className="ml-2">Audio Player Functions</span>
                    </label>
                </InputGroup>
                {this.state.node.extras.player ? 
                    <span className="text-muted">
                        Users will be able to say playlist commands such as 'Next', 'Previous', 'Start Over', and toggle 'Loop' 
                    </span> :
                    <span className="text-muted">
                        User Commands such as 'Next', 'Previous' will be routed to stop/pause
                    </span> 
                }
            </div>
        );
    }
}

export default Stream;
