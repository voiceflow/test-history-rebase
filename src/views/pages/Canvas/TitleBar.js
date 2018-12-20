import React, { Component } from 'react';
import MUIButton from '@material-ui/core/Button';

class TitleBar extends Component {
    render() {
        return (
            <div className="TitleBar no-select">
                <div className="project">
                    <div className="skill-name">
                        {this.props.skill.name}
                    </div>
                    <MUIButton id="test" variant="extendedFab" className="white-btn play" onClick={this.props.onTest}><span className="words">Test</span><span className="button-circle"><i className="fas fa-play"/></span></MUIButton>
                  </div>
            </div>
        );
    }
}

export default TitleBar;
