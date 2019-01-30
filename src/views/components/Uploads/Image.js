import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import {Input} from 'reactstrap'

const MAX_SIZE = 5*1024*1024

class Image extends Component {

 	constructor(props) {
        super(props);

        this.onDropImage = this.onDropImage.bind(this);

        this.state = {
            error: null,
            loading: false,
            url_open: false,
            url: ''
        }
        
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    onDropImage(files, rejected) {
        if (files.length === 1) {
            let data = new FormData();
            data.append('image', files[0]);
            this.setState({loading: true});
            axios.post('/image' + (this.props.path ? this.props.path : ''), data)
            .then(res => {
                this.setState({loading: false});
            	this.props.update(res.data);
            })
            .catch(err => {
                this.setState({loading: false});
            	console.error(err);
            	window.alert('Image Upload Error');
            });
        }else if(Array.isArray(rejected) && rejected.length === 1 && rejected[0].size > MAX_SIZE){
            this.setState({
                error: <div>
                    <b>File is too large<br/>(5MB max)</b>
                </div>
            })
        }
    }

	render() {
        let render
        if(this.state.loading){
            render = <div className="image-box super-center d-flex">
                <div className="h-100 super-center">
                    <h1 className="mb-0"><span className="loader"/></h1>
                </div>
            </div>
        }else if(!!this.state.error){
            render = <div className="dropzone reject enter-url">
                <div className="text-center text-danger">
                    {this.state.error}
                    <button onClick={()=>this.setState({error: false})} className="upload-btn btn btn-primary-small exit">
                        <i className="far fa-chevron-left"/>Back
                    </button>
                </div>
            </div>
        }else if(this.props.image){
            render = <div className="image-box">
                <div className="image" style={{backgroundImage: `url(${this.props.image})`}}></div>
                <button className="btn btn-danger" disabled={this.props.isDisabled} onClick={() => this.props.update(null)}>&times;</button>
            </div>
        }else if(this.state.url_open){
            render = <div className="dropzone enter-url">
                <div className="text-center w-100">
                    <p className="prompt-text">Enter Image URL</p>
                    <Input placeholder="URL Link" value={this.state.url} onChange={this.handleChange} name="url"/>
                    <button onClick={()=>this.setState({url_open: false})} className="upload-btn btn btn-default exit"><i className="far fa-chevron-left"/>Back</button>
                    <button onClick={()=>this.props.update(this.state.url)} className="upload-btn btn btn-primary-small">Confirm</button>
                </div>
            </div>
        }else{
            render = <React.Fragment>
                <Dropzone
                    className="dropzone"
                    activeClassName="active"
                    rejectClassName="reject"
                    multiple={false}
                    disableClick={false}
                    maxSize={this.props.max_size ? this.props.max_size : MAX_SIZE}
                    accept="image/jpeg, image/png"
                    onDrop={this.onDropImage}
                >
                    <div className="w-100">
                        <div className="drop-child">
                            Drag-n-Drop Image OR <a href="#" onclick={() => {return false}}>Browse</a><br/>
                            {this.props.url && <button className="upload-btn btn btn-default" onClick={(e)=>{
                                e.preventDefault()
                                e.stopPropagation()
                                this.setState({url_open: true})
                                return false
                            }}>URL</button>}
                        </div>
                        <div className="rejected-file text-danger">
                            <b>File not Accepted</b>
                        </div>
                    </div>
                </Dropzone>
            </React.Fragment>
        }

        return <div className={(this.props.className ? this.props.className : 'image-standard' ) + (this.props.isDisabled ? ' disabled-image' : '')}>
            <label>{this.props.title}</label>
            {render}
        </div>
	}
}

export default Image;
