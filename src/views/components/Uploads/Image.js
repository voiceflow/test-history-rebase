import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';

class Image extends Component {

 	constructor(props) {
        super(props);

        this.onDropImage = this.onDropImage.bind(this);

        this.state = {
            loading: false
        }
    }

    onDropImage(files) {
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
        }
    }

	render() {
        let render;
        if(this.state.loading){
            render = <div className="image-box super-center d-flex">
                <h1 className="mb-0"><i className="fas fa-sync-alt fa-spin"/></h1>
            </div>
        }else if(this.props.image){
            render = <div className="image-box">
                <div className="image" style={{backgroundImage: `url(${this.props.image})`}}></div>
                <button className="btn btn-danger" disabled={this.props.isDisabled} onClick={() => this.props.update(null)}>&times;</button>
            </div>
        }else{
            render = <Dropzone
                className="dropzone"
                activeClassName="active"
                rejectClassName="reject"
                multiple={false}
                disableClick={false}
                accept="image/jpeg, image/png"
                onDrop={(accepted, rejected) => this.onDropImage(accepted)}
            >
                <div>
                    <div className="prompt">
                        <img src="/images/img.png" alt="media"/><br/>
                        <b>Drag-n-Drop Image</b><br/>
                        <small>OR</small><br/>
                        Click to add
                    </div>
                    <div className="rejected-file text-danger">
                        <b>File not Accepted</b> <i className="far fa-frown ml-1"></i>
                    </div>
                </div>
            </Dropzone>
        }

        return <div className={this.props.className + (this.props.isDisabled ? ' disabled-image' : '')}>
            {render}
        </div>
	}
}

export default Image;
