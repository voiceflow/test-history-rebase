import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import {
    Input,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap'
import { renameDiagram } from 'ducks/diagram'
import cn from 'classnames'

class FlowButton extends Component {

    constructor(props) {
      super(props);

      this.state = {
          edit: false,
          name: props.diagram.name ? props.diagram.name : ''
      }

      this.close = this.close.bind(this);
      this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
      this.setState({
        [event.target.name]: event.target.value
      });
    }

    close() {
      if (!this.props.preview){
        this.props.renameFlow(this.props.flow.id, this.state.name).then(() => {
          this.setState({
            edit: false,
          });
        })
      }
    }

    render() {
      if(!this.props.diagram) return null;

        let active = this.props.active === this.props.flow.id;
        return (
          <div className={cn("diagram-block", {"active" : active})}>
              <button
                className="diagram-button"
                onClick={active ? null : ()=>this.props.enterFlow(this.props.flow.id)}
                style={{marginLeft: this.props.depth ? this.props.depth * 20 : 0}}
              >
                  <i className="flow-icon mr-3"/>
                  {this.state.edit ? <Input 
                        name="name"
                        className="diagram-text"
                        value={this.state.name}
                        onChange={this.handleChange}
                        onKeyPress={target => target.charCode === 13 ? this.close() : null}
                        onBlur={this.close}
                        autoFocus
                    /> : < span className="diagram-text" > {
                      this.props.flow.name === 'ROOT' ? 'HOME' : _.trim(this.props.diagram.name) ?
                          (this.props.diagram.name.length > 15 ? `${this.props.diagram.name.substring(0,15)}...` : this.props.diagram.name) : 'Flow'
                  } </span>}
              </button>
              { (this.props.flow.name !== 'ROOT' && !this.props.preview && !this.state.edit) &&
                  <UncontrolledDropdown inNavbar>
                      <DropdownToggle className="diagram-edit" tag='button'>
                          <i className="fas fa-cog"/>
                      </DropdownToggle>
                      <DropdownMenu right className="arrow arrow-right no-select" style={{marginTop: -2}}>
                          <DropdownItem header>
                              Flow Options
                          </DropdownItem>
                          <DropdownItem onClick={()=>this.setState({edit: true, name: this.props.diagram.name})} className="pointer">
                                Edit Name
                          </DropdownItem>
                          <DropdownItem onClick={this.props.copyFlow} className="pointer">
                                Copy
                          </DropdownItem>
                          <DropdownItem onClick={this.props.deleteFlow} className="pointer">
                                Delete
                          </DropdownItem>
                      </DropdownMenu>
                  </UncontrolledDropdown>
              }
          </div>
        );
    }
}

const mapStateToProps = (state, props) => ({
    active: state.skills.skill.diagram,
    diagram: _.find(state.diagrams.diagrams, d => d.id === props.flow.id)
})

const mapDispatchToProps = dispatch => {
    return {
        renameFlow: (flow_id, name) => dispatch(renameDiagram(flow_id, name))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FlowButton);
