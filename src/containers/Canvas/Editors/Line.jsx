import React, { Component } from 'react'
import axios from 'axios'
import { Collapse } from 'reactstrap'

import Button from 'components/Button'
import MultiLineInput from './components/MultiLineInput'

class Line extends Component {
    constructor(props) {
        super(props);

        // DEPRECATE extremely old audio blocks
        if(props.node.extras.audio){
            props.node.extras.lines = []
            props.node.extras.lines.push({
                audio: props.node.extras.audio
            })
        }

        this.state = {
            node: this.props.node,
            voices: this.props.voices,
            loading: false
        }

        this.handleAddLine = this.handleAddLine.bind(this);
        this.handleRemoveLine = this.handleRemoveLine.bind(this);
        this.handleNewAudio = this.handleNewAudio.bind(this);
        this.concat = this.concat.bind(this);
    }

    handleAddLine() {
        var node = this.state.node;
        if(node.extras.lines.length < 5 ){
            node.extras.lines.push({
                collapse: true,
                audio: false,
                title: "Line Audio"
            });
            this.setState({
                node: node
            }, this.props.onUpdate);
        }
    }

    handleRemoveLine(index) {
        var node = this.state.node;
        if(node.extras.lines.length > 1 ){
            node.extras.lines.splice(index, 1);
            if(node.extras.lines.length > 1){
                this.concat();
            }else{
                let node = this.state.node;
                node.extras.audio = false;
            }
            this.setState({
                node: node
            }, this.props.onUpdate);
        }
    }

    handleNewAudio(){
        this.props.onUpdate();
        if(this.state.node.extras.lines.length > 1){
            this.concat();
        }
    }

    concat(){
        let lines = [];
        this.state.node.extras.lines.forEach((line) => {
            if(line.audio && line.audio !== ''){
                lines.push(line.audio);
            }
        });

        if(lines.length <= 1){
            return;
        }

        this.setState({loading: true});

        axios.post('/concat', {lines: lines})
        .then(res => {
            let node = this.state.node;
            if(this.state.node.extras.lines.length > 1){
                node.extras.audio = res.data
                this.setState({
                    node: node,
                    loading: false
                })
            }else{
                this.setState({
                    loading: false
                })
            }
        })
        .catch(err => {
            this.setState({loading: false});
            window.alert('Concat Error');
        })
    }

    render() {
        return (
            <div>
                <Collapse isOpen={(!!this.state.node.extras.audio || !!this.state.loading)}>
                    { this.state.node.extras.audio || this.state.loading ?
                        <div>{ this.state.loading ?
                            <div className="combined-box">
                                <h1><span className="loader"/></h1>
                            </div> :
                            <div className="combined-box">
                                <div><i className="fas fa-layer-group"></i> Combined Audio</div>
                                <audio key="combined" controls>
                                    <source src={this.state.node.extras.audio} type="audio/mpeg" />
                                </audio>
                            </div>
                        }</div> : <div className="combined-box"></div>
                    }
                </Collapse>
                {this.state.node.extras.lines.map((line, index) => {
                    return <MultiLineInput
                        key={index}
                        index={index}
                        line={line}
                        voices={this.state.voices}
                        onUpdate={this.props.onUpdate}
                        onRemove={this.handleRemoveLine}
                        newAudio={this.handleNewAudio}
                    />
                })}
                <div className="mt-3">
                    <Button isBtn isClear isLarge isBlock onClick={this.handleAddLine}>
                        Add Line Audio <i className="fas fa-plus-circle ml-1"></i>
                    </Button>
                </div>
            </div>
        );
    }
}

export default Line;
