import React, { Component } from 'react';

class Story extends Component {
    render() {
        return (
            <div>
              <p className="modal-bg-txt text-center mt-5 mb-2">
                 Let's get started! <span role="img" aria-label="happy">😊</span>
              </p>
              <p className="modal-txt-no-pad text-center mb-4"> Watch this 5 minute introduction video by Voiceflow's CEO to familiarize yourself with our creator tool!</p>
              <div className="embed-responsive box-shadow embed-responsive-16by9 rounded">
                <iframe src="https://www.youtube.com/embed/WQnBhEVTTCA" allowFullScreen title="intro"></iframe>
              </div>
            </div>
        );
    }
}

export default Story;
