import React, {Component} from 'react'
import Dropzone from 'react-dropzone'
import {Input} from 'reactstrap'
import axios from 'axios'

const MAX_SIZE = 10*1024*1024

class AudioDrop extends Component {

	constructor(props) {
        super(props);

        this.state = {
            loading: false,
            error: null,
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
        })
    }

    onDrop(files, rejected) {
        if(files.length === 1){
            this.setState({loading: true})
            if (files.length > 0) {
                let data = new FormData()
                data.append('audio', files[0])
                axios.post(this.props.stream ? '/raw_audio' : '/audio', data)
                .then(res => {
                    this.setState({loading: false})
                    this.props.update(res.data)
                })
                .catch(err => {
                    this.setState({loading: false})
                })
            }
        }else if(Array.isArray(rejected) && rejected.length === 1 && rejected[0].size > MAX_SIZE){
            this.setState({
                error: <div>
                    <b>File is too large (10MB max)</b>
                    <br/>
                    consider hosting on
                    <div className="seperated-links my-2">
                        <a href="https://www.google.com/drive/" target='_blank' rel="noopener noreferrer"><i className="fab fa-google"/> Drive</a>| 
                        <a href="https://www.digitalocean.com/products/spaces/" target='_blank' rel="noopener noreferrer"><i className="fab fa-digital-ocean"/> Spaces</a>|
                        <a href="https://aws.amazon.com/s3/" target='_blank' rel="noopener noreferrer"><i className="fab fa-aws"/> S3</a>|
                        <a href="https://www.dropbox.com" target='_blank' rel="noopener noreferrer"><i className="fab fa-dropbox"/> Dropbox</a>
                    </div>
                </div>
            })
        }
    }

    onClear() {
        this.props.update('');
    }

	render() {
        if(this.state.loading){
            return <div className="audio-box">
                <div className="h-100 super-center">
                    <h1 className="mb-0"><span className="loader"/></h1>
                </div>
            </div>
        } else if(!!this.state.error){
            return <div className="dropzone reject enter-url">
                <div className="text-center text-danger">
                    {this.state.error}
                    <button onClick={()=>this.setState({error: false})} className="upload-btn btn btn-primary-small exit">
                        <i className="far fa-chevron-left"/>Back
                    </button>
                </div>
            </div>
        } else if(this.props.audio && typeof this.props.audio === 'string'){
            return <div className="audio-box">
                <button className="btn btn-danger" onClick={this.onClear}>&times;</button>
                <div>{this.props.audio.split('/').pop().split('-').pop()}</div>
                <audio key={this.props.audio.split('/').pop()} controls>
                    <source src={this.props.audio} type="audio/mpeg" />
                </audio>
            </div>
        }else if(this.state.url_open){
            return <div className="dropzone">
                <div className="text-center w-100">
                    <label className="text-muted mb-3">Enter Audio URL</label>
                    <Input className="mb-3" placeholder="URL Link" value={this.state.url} onChange={this.handleChange} name="url"/>
                    <button onClick={()=>this.setState({url_open: false})} className="btn-tertiary mr-1">Back</button>
                    <button onClick={()=>this.props.update(this.state.url)} className="btn-primary ml-1">Confirm</button>
                </div>
            </div>
        }else{
            return <Dropzone
                className="dropzone"
                activeClassName="active"
                rejectClassName="reject"
                multiple={false}
                disableClick={false}
                maxSize={MAX_SIZE}
                accept={(this.props.stream ? ".m3u,.m3u8," : "") + "audio/*"}
                onDrop={this.onDrop}
            >
                <div>
                    <div className="drop-child">
                        <div className="mb-1">Drag and Drop files here</div>
                        <small>OR</small><br/>
                        <div className="mt-2">
                            <div className="btn btn-primary-small mb-2">
                                Add Audio
                            </div>
                            <br/>
                            <div className="btn-link" onClick={(e)=>{
                                e.preventDefault()
                                e.stopPropagation()
                                this.setState({url_open: true})
                                return false
                            }}>Add URL</div>
                        </div>
                    </div>
                    <div className="rejected-file text-danger">
                        <b>File not Accepted</b>
                    </div>
                </div>
            </Dropzone>
        }
	}
}

export default AudioDrop;