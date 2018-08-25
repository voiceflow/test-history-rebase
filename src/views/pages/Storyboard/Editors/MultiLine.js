import React, { Component } from 'react';
import MultiLineInput from './MultiLineInput';
import $ from 'jquery';
import { Collapse } from 'reactstrap';

class MultiLine extends Component {
    constructor(props) {
        super(props);

        this.state = {
            node: this.props.node,
            voices: this.props.voices,
            loading: false
        };

        this.handleAddLine = this.handleAddLine.bind(this);
        this.handleRemoveLine = this.handleRemoveLine.bind(this);
        this.handleNewAudio = this.handleNewAudio.bind(this);
        this.concat = this.concat.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({
            node: props.node,
            voices: props.voices
        });
    }

    handleAddLine() {
        var node = this.state.node;
        if(node.extras.lines.length < 5 ){
            node.extras.lines.push({
                textCollapse: false,
                collapse: true,
                text: '',
                audio: false,
                voice: false,
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
        this.setState({loading: true});

        let lines = [];
        this.state.node.extras.lines.forEach((line) => {
            lines.push(line.audio);
        });

        $.ajax({
            url: '/concat',
            type: 'POST',
            data: {
                lines: lines
            },
            success: res => {
                let node = this.state.node;
                if(this.state.node.extras.lines.length > 1){
                    node.extras.audio = res;
                    this.setState({
                        node: node,
                        loading: false
                    });
                }else{
                    this.setState({
                        loading: false
                    });
                }
            },
            error: () => {
                this.setState({loading: false});
                window.alert('Concat Error');
            }
        });
    }

    render() {
        return (
            <div key={this.state.node.id}>
                <Collapse isOpen={(!!this.state.node.extras.audio || !!this.state.loading)}>
                    { this.state.node.extras.audio || this.state.loading ?
                        <div>{ this.state.loading ? 
                            <div className="combined-box">
                                <h1><i className="fas fa-sync-alt fa-spin"></i></h1>
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
                { (this.state.node.extras.lines.length < 5) ? <div className="mt-3"><button className="btn btn-outline-secondary btn-block" onClick={this.handleAddLine}>Add Line Audio <i className="fas fa-plus-circle ml-1"></i></button></div> : null}
            </div>
        );
    }
}

export default MultiLine;
