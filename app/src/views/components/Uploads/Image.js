import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';

class Image extends Component {

 	constructor(props) {
        super(props);

        this.onDropImage = this.onDropImage.bind(this);
    }

    onDropImage(files) {
        if (files.length > 0) {
            let data = new FormData();
            data.append('image', files[0]);
            axios.post('/image', data)
            .then(res => {
            	this.props.update(res.data);
            })
            .catch(err => {
            	console.error(err);
            	window.alert('Image Upload Error');
            });
        }
    }

	render() {

        return <div className={this.props.className}>
        { this.props.image ? 
            <div className="image-box">
            	<div className="image" style={{backgroundImage: `url(${this.props.image})`}}></div>
                <button className="btn btn-danger" onClick={() => this.props.update(null)}>&times;</button>
            </div>
            :
            <Dropzone
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
                        <b>Drag and Drop Image here</b><br/>
                        <small>OR</small><br/>
                        <i className="fas fa-plus-circle"></i> Add Image
                    </div>
                    <div className="rejected-file text-danger">
                        <b>File not Accepted</b> <i className="far fa-frown ml-1"></i>
                    </div>
                </div>
            </Dropzone> }
        </div>
	}
}

export default Image;