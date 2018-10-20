import React, {Component} from 'react';
import $ from 'jquery';
import Dropzone from 'react-dropzone';

class AudioDrop extends Component {

	constructor(props) {
        super(props);

        this.onDrop = this.onDrop.bind(this);
        this.onClear = this.onClear.bind(this);
    }

    onDrop(files) {
        if (files.length > 0) {
            let data = new FormData();
            data.append('audio', files[0]);
            $.ajax({
                url: '/audio',
                type: 'POST',
                data: data,
                processData: false,
                contentType: false,
                success: res => {
                    this.props.update(res);
                },
                error: () => {window.alert('Error22');}
            });
        }
    }

    onClear() {
        this.props.update('');
    }

	render() {
        let render = (this.props.audio ? 
            <div className="audio-box">
                <button className="btn btn-danger" onClick={this.onClear}>&times;</button>
                <div>{this.props.audio.split('/').pop().split('-').pop()}</div>
                <audio key={this.props.audio.split('/').pop()} controls>
                    <source src={this.props.audio} type="audio/mpeg" />
                </audio>
            </div>
            :
            <Dropzone
                className="dropzone"
                activeClassName="active"
                rejectClassName="reject"
                multiple={false}
                disableClick={false}
                accept="audio/*"
                onDrop={(accepted, rejected) => this.onDrop(accepted)}
            >
	            <div>
	                <div className="prompt">
	                    <b>Drag and Drop Files here</b><br/>
	                    <small>OR</small><br/>
	                    <i className="fas fa-plus-circle"></i> Add Files
	                </div>
	                <div className="rejected-file text-danger">
	                    <b>File not Accepted</b> <i className="far fa-frown ml-1"></i>
	                </div>
	            </div>
            </Dropzone>)
        return render;
	}
}

export default AudioDrop;