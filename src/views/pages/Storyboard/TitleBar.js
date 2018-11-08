import React, { PureComponent } from 'react';
// import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown } from 'reactstrap';
import MUIButton from '@material-ui/core/Button';
// import {Link} from 'react-router-dom';

// import axios from 'axios'

class TitleBar extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            dropdownOpen: false,
            projects: false,
            publish: false,
            diagrams: []
        }

        this.handleChange = this.handleChange.bind(this);

        this.toggle = this.toggle.bind(this);
    }

    handleChange(e) {
        let node = this.state.story;
        let name = e.target.getAttribute('name');
        let value = e.target.value;
        
        node.extras[name] = value;
    }

    toggle() {
        this.setState({
          dropdownOpen: !this.state.dropdownOpen
        });
    }

                //     <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} className="main-menu-btn-group">
                //     <DropdownToggle caret className="main-menu-btn">
                //       Project
                //     </DropdownToggle>
                //     <DropdownMenu>
                //         <DropdownItem onClick={this.props.onSave}>Save</DropdownItem>
                //         <UncontrolledDropdown direction="right" isOpen={this.state.projects} toggle={() => { this.setState({ projects : !this.state.projects }); }}>
                //             <DropdownToggle tag="button" caret className="dropdown-item load-btn">
                //                 Load
                //             </DropdownToggle>
                //             <DropdownMenu className="projects-menu">
                //                 { this.state.diagrams.length !== 0 ? this.state.diagrams.map(diagram => {
                //                     return <DropdownItem key={diagram.id} onClick={() => {this.props.onLoadId(diagram.id); this.setState({ dropdownOpen : false })}}>{diagram.title ? diagram.title : diagram.id}</DropdownItem>;
                //                 }) : <DropdownItem disabled>No Diagrams Saved</DropdownItem> }
                //             </DropdownMenu>
                //         </UncontrolledDropdown>
                //         <DropdownItem onClick={this.props.onTest}>Test&nbsp;&nbsp;<i className="fas fa-flask"></i></DropdownItem>
                //         <DropdownItem onClick={this.props.publish}>Publish Skill</DropdownItem>
                //         {
                //             this.props.admin ? 
                //             <div>
                //                 <DropdownItem divider />
                //                 <DropdownItem onClick={this.props.onLoadLines}>Update User Flow</DropdownItem>
                //             </div>
                //             : null
                //         }
                //     </DropdownMenu>
                // </ButtonDropdown>

                //                 <input
                //     name="story"
                //     onChange={this.props.onUpdateTitle}
                //     value={this.props.title}
                //     placeholder="Diagram Name"
                // />
                // <div className="status">
                //     {this.props.saving ?
                //         <div><i className="fas fa-sync-alt fa-spin"></i> {"Saving..."}</div>
                //         :
                //         (saved)
                //     }
                // </div>

    render() {
        // <DropdownItem onClick={()=>{}}>Submit for Review</DropdownItem>
        return (
            <div className="TitleBar no-select">
                {this.props.preview ? null : 
                    <div className="title-group">
                        <MUIButton variant="contained" className="white-btn save-btn mr-2" onClick={this.props.onSave}>{this.props.saving ? <i className="fas fa-sync-alt fa-spin"/> : "Save Draft"}</MUIButton>
                        <MUIButton variant="contained" className="white-btn save-btn" onClick={this.props.publish}>Publish</MUIButton>
                    </div>
                }
                <div className="project">
                    <div className="skill-name">
                        {this.props.skill.name}
                    </div>
                    <MUIButton variant="extendedFab" className="white-btn play" onClick={this.props.onTest}><span className="words">Test</span><span className="button-circle"><i className="fas fa-play"/></span></MUIButton>
                </div>
            </div>
        );
    }
}

export default TitleBar;
