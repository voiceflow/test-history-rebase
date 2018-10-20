import React, { PureComponent } from 'react';
import MenuItem from './MenuItem';

const sections = [{
    title: 'Basic',
    items: [
        { text: 'Speak', type: 'speak', icon: <i className="fas fa-megaphone"/> },
        { text: 'Audio', type: 'audio', icon: <i className="fas fa-volume-up"/> },
        { text: 'Choice', type: 'choice', icon: <i className="fas fa-project-diagram"/> },
        { text: 'Command', type: 'command', icon: '⌘' }
    ]
},{
    title: 'Advanced',
    items: [
        { text: 'Random', type: 'random', icon: <i className="fas fa-random"/>},
        { text: 'Set', type: 'set', icon: <i className="fas fa-code"/> },
        { text: 'If', type: 'if', icon: <i className="fas fa-code-branch"/>},
        { text: 'Capture', type: 'capture', icon: <i className="fas fa-microphone"/> },
        { text: 'Diagram', type: 'diagram', icon: <i className="fas fa-clone"/> }
    ]
}];
                   // <div className="mt-5">
                     //   <small><a href="https://getstoryflow.com">STORY SCHOOL <i className="fas fa-question-circle"/></a></small>
                   // </div>
class Menu extends PureComponent {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <div className='Menu'>
                <div className='sidebar'>
                    <p className="saved">{this.props.lastSave}</p>
                    <hr/>
                    <div className='block-title'>
                        <h5>Blocks</h5>
                        <p className="font-weight-light">Drag-n-drop blocks into your flow <i className="far fa-arrow-right"/></p>
                    </div>
                    {sections.map((section, i) => {
                        return <div key={i} className="section">
                            <span className="section-title">{section.title}</span>
                            {section.items.map((item, i) => {
                                return <MenuItem key={i} item={item} />;
                            })}
                        </div>
                    })}
                </div>
            </div>
        );
    }
}

export default Menu;
