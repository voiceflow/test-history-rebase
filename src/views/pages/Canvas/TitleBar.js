import React, { PureComponent } from 'react';
import MUIButton from '@material-ui/core/Button';

class TitleBar extends PureComponent {
    render() {
        let block = this.props.diagrams.find(d => d.id === this.props.diagram)
        return (
            <div className="no-select" id="TitleBar">
                <div className="project">
                    <div className="skill-name">
                        {!!block && block.name !== 'ROOT' && block.name}
                    </div>
                    <MUIButton id="test" className="white-btn play" onClick={this.props.onTest}><span className="words">Test</span><span className="button-circle"><img src={'/play.svg'} width='10'/></span></MUIButton>
                </div>
            </div>
        );
    }
}

export default TitleBar;
