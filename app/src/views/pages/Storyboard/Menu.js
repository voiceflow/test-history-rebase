import React, { PureComponent } from 'react';
import MenuItem from './MenuItem';
import { Link } from 'react-router-dom'

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
        { text: 'Variable', type: 'variable', icon: <i className="fas fa-code"/> },
        { text: 'If', type: 'if', icon: <i className="fas fa-code-branch"/>},
        { text: 'Capture', type: 'capture', icon: <i className="fas fa-microphone"/> },
        { text: 'Flow', type: 'flow', icon: <i className="fas fa-clone"/> }
    ]
}];

// { text: 'Diagram', type: 'diagram', icon: <i className="fas fa-clone"/> }
                   // <div className="mt-5">
                     //   <small><a href="https://getstoryflow.com">STORY SCHOOL <i className="fas fa-question-circle"/></a></small>
                   // </div>

const tabs = [
    {tab: "blocks", icon: <i className="fas fa-plus-square"/>},
    {tab: "flows", icon: <i className="fas fa-clone"/>}
]

class Menu extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            open: true,
            tab: 'blocks'
        }

        this.openTab = this.openTab.bind(this);
    }

    openTab(tab) {
        this.setState({
            open: true,
            tab: tab
        });
    }



                // <div className='no-select'>

                // </div>

    render() {
        return (
            <div className="Menu">
                <div className='toolbar'>
                    <div className="top-down">
                        {tabs.map(tab => {
                            return (
                                <div className="tool" onClick={() => this.openTab(tab.tab)}>
                                    {tab.icon}
                                </div>
                            )
                        })}
                    </div>
                    <div className="spacer"/>
                    <div className="bottom-up">
                        <a className="tool no-underline" href="https://getstoryflow.com/storyschool" 
                        target="_blank" rel="noopener noreferrer">
                            <i className="fas fa-graduation-cap"/>
                        </a>
                        <div className="tool" onClick={this.props.helpModal}>
                            <i className="fas fa-question-circle"/>
                        </div>
                    </div>
                </div>
                <div id="sidebar" className={this.state.open ? 'open' : ''}>
                    <p className="saved">{this.props.lastSave}</p>
                    <hr/>
                    <div className='block-title'>
                        <div className="" onClick={() => this.setState({open: false})}>
                            <h5 className="mb-0">Blocks</h5>
                            <div className="close pr-1 pl-3 py-3">×</div>
                        </div>
                    </div>
                    {sections.map((section, i) => {
                        return <div key={i} className="section">
                            <span className="section-title">{section.title}</span>
                            {section.items.map((item, i) => {
                                return <MenuItem item={item} key={i} />;
                            })}
                        </div>
                    })}
                </div>
            </div>
        );
    }
}

export default Menu;
