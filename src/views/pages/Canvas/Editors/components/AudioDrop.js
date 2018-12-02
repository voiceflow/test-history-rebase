import React, {Component} from 'react'
import $ from 'jquery'
import Dropzone from 'react-dropzone'
import {Input, Button} from 'reactstrap'

class AudioDrop extends Component {

	constructor(props) {
        super(props);

        this.state = {
            loading: false,
            url_open: false,
            url: ''
        }

        this.onDrop = this.onDrop.bind(this)
        this.onClear = this.onClear.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    onDrop(files) {
        this.setState({loading: true})
        if (files.length > 0) {
            let data = new FormData()
            data.append('audio', files[0])
            $.ajax({
                url: this.props.stream ? '/raw_audio' : '/audio',
                type: 'POST',
                data: data,
                processData: false,
                contentType: false,
                success: res => {
                    this.setState({loading: false})
                    this.props.update(res)
                },
                error: () => {
                    this.setState({loading: false})
                    window.alert('Error22')
                }
            });
        }
    }

    onClear() {
        this.props.update('');
    }

	render() {
        let render;

        if(this.state.loading){
            render = <div className="audio-box">
                <div className="h-100 super-center">
                    <h1 className="mb-0"><span className="loader"/></h1>
                </div>
            </div>
        } else if(this.props.audio){
            render = <div className="audio-box">
                <button className="btn btn-danger" onClick={this.onClear}>&times;</button>
                <div>{this.props.audio.split('/').pop().split('-').pop()}</div>
                <audio key={this.props.audio.split('/').pop()} controls>
                    <source src={this.props.audio} type="audio/mpeg" />
                </audio>
            </div>
        }else if(this.state.url_open){
            render = <div className="dropzone enter-url">
                <div className="text-center w-100">
                    <p className="prompt-text">Enter Audio URL</p>
                    <Input placeholder="URL Link" value={this.state.url} onChange={this.handleChange} name="url"/>
                    <Button onClick={()=>this.setState({url_open: false})} color="default" className="exit"><i className="far fa-chevron-left"/>Back</Button>
                    <Button onClick={()=>this.props.update(this.state.url)}>Confirm</Button>
                </div>
            </div>
        }else{
            render = <Dropzone
                className="dropzone"
                activeClassName="active"
                rejectClassName="reject"
                multiple={false}
                disableClick={false}
                accept={(this.props.stream ? ".m3u,.m3u8," : "") + "audio/*"}
                onDrop={(accepted, rejected) => this.onDrop(accepted)}
            >
                <div>
                    <div className="text-muted text-center mb-3">
                        <b>Drag and Drop files here</b><br/>
                        <small>OR</small><br/>
                        <div className="space-between">
                            <button className="upload-btn btn btn-primary-small">
                                Add File
                            </button>
                            <button className="upload-btn btn btn-default" onClick={(e)=>{
                                e.preventDefault()
                                e.stopPropagation()
                                this.setState({url_open: true})
                                return false
                            }}>URL</button>
                        </div>
                    </div>
                    <div className="rejected-file text-danger">
                        <b>File not Accepted</b> <i className="far fa-frown ml-1"></i>
                    </div>
                </div>
            </Dropzone>
        }

        return render;
	}
}

export default AudioDrop;