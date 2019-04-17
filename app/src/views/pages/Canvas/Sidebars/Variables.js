import React, { PureComponent } from "react";
import { connect } from "react-redux";
import {
  pushVariable,
  setVariables
} from "./../../../../actions/variableActions";
import { updateVersion } from "./../../../../actions/versionActions";
import { setError } from "actions/modalActions";
import {
  Input,
  FormGroup,
  Label
} from "reactstrap";
import { Tooltip } from "react-tippy";
import isVarName from "is-var-name";

const defaultVariables = {
  sessions: "The Number of times a particular user has opened the app",
  user_id: "The user's Amazon/Google unique id",
  timestamp:
    "UNIX timestamp (number of seconds since January 1st, 1970 at UTC.)",
  platform: 'The platform your skill is running on ("alexa" or "google")',
  locale: "The locale of the user (eg en-US, en-CA, it-IT, fr-FR ...)"
};

const tt = (width, message) => <div style={{ width: width }}>{message}</div>

export class Variables extends PureComponent {
  constructor(props) {
    super(props);

    let tab = localStorage.getItem("variable_tab");
    if (!tab) tab = "global";

    this.state = {
      tab: tab,
      new_var: "",
      new_global: ""
    };

    this.addVariable = this.addVariable.bind(this);
    this.addGlobalVariable = this.addGlobalVariable.bind(this);
    this.deleteVariable = this.deleteVariable.bind(this);
    this.deleteGlobalVariable = this.deleteGlobalVariable.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.switchTab = this.switchTab.bind(this);
  }

  switchTab(tab) {
    if (tab !== this.state.tab) {
      this.setState(
        {
          tab: tab
        },
        () => localStorage.setItem("variable_tab", tab)
      );
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  addVariable(e) {
    if (e) e.preventDefault();
    let variables = this.props.variables;
    let new_var = this.state.new_var;
    if (
      isVarName(new_var) &&
      !variables.includes(new_var) &&
      !this.props.global_variables.includes(new_var)
    ) {
      this.props.addVariable(new_var);
      this.setState({
        new_var: ""
      });
    } else {
      alert(
        "Invalid Variable: Variables must start with a character and can not contain spaces or special characters"
      );
    }
    return false;
  }

  addGlobalVariable(e) {
    if (e) e.preventDefault();
    let variables = this.props.global_variables;
    let new_var = this.state.new_global;
    if (
      isVarName(new_var) &&
      !variables.includes(new_var) &&
      !this.props.variables.includes(new_var)
    ) {
      variables.push(new_var);
      this.props.updateSkill("globals", variables);
      this.setState({
        new_global: ""
      });
    } else {
      this.props.setError(
        "Invalid Variable: Variables can't have the same name and must start with a character and can not contain spaces or special characters"
      );
    }
    return false;
  }

  deleteVariable(variable) {
    let variables = this.props.variables;
    let index = variables.indexOf(variable);
    if (index !== -1) variables.splice(index, 1);
    this.props.setVariables(variables);
    this.forceUpdate();
  }

  deleteGlobalVariable(variable) {
    let variables = this.props.global_variables;
    let index = variables.indexOf(variable);
    if (index !== -1) variables.splice(index, 1);
    this.props.updateSkill("globals", variables);
    this.forceUpdate();
  }

  render() {
    return (
      <React.Fragment>
        {this.state.tab !== "local" ? (<>
          <form id="variable-submit" onSubmit={this.addGlobalVariable}>
            <FormGroup className="mb-0 text-center">
              <Label className="mt-2 text-left">
                Create Variable
                <Tooltip
                  position="bottom"
                  html={tt(180, "Project Variables can be used anywhere in the project and save across sessions")}
                >
                  <span onClick={()=>this.setState({tab: "local"})} className="pointer"> (Project)</span>
                </Tooltip>
              </Label>
              <div className="variable-box">
                <Input
                  autoFocus
                  readOnly={this.props.locked}
                  name="new_global"
                  value={this.state.new_global}
                  onChange={this.handleChange}
                  maxLength="16"
                  placeholder="Variable Name"
                />
              </div>
            </FormGroup>
          </form>
          <small className="text-muted mb-4 pt-2 d-block">
          Press <b>'Enter'</b> to add variable
        </small>
          </>
        ) : (<>
          <form id="variable-submit" onSubmit={this.addVariable}>
            <FormGroup className="mb-0 text-center">
              <Label className="mt-2 text-left">
                Create Variable
                <Tooltip
                  position="bottom"
                  html={tt(180, "Flow Variables exist only in this flow and are reset after you leave the flow")}
                >
                  <span onClick={()=>this.setState({tab: "global"})} className="pointer"> (Flow)</span>
                </Tooltip>
              </Label>
              <div className="variable-box">
                <Input
                  autoFocus
                  readOnly={this.props.locked}
                  name="new_var"
                  value={this.state.new_var}
                  onChange={this.handleChange}
                  maxLength="16"
                  placeholder="Flow Variable Name"
                />
              </div>
            </FormGroup>
          </form>
          <small className="text-muted mb-4 pt-2 d-block">
          Press <b>'Enter'</b> to add flow variable
        </small>
        </>)}
        <hr />
        <div>
          {this.props.variables.length > 0 && (
            <div className="mb-4">
              <Label>Flow Variables</Label>
              <div className="variables">
                {this.props.variables.map(
                  function(variable, i) {
                    return (
                      <div key={variable} className="variable_tag">
                        {"{" + variable + "}"}{" "}
                        <span onClick={() => this.deleteVariable(variable)}>
                          <i className="fas fa-times" />
                        </span>
                      </div>
                    );
                  }.bind(this)
                )}
              </div>
            </div>
          )}
          <Label>Project Variables</Label>
          <div className="variables">
            {this.props.global_variables.map((variable, i) => {
              if (variable in defaultVariables) {
                return (
                  <Tooltip
                    key={variable}
                    position="bottom"
                    html={
                      <div style={{ width: 165 }}>
                        {defaultVariables[variable]}
                      </div>
                    }
                  >
                    <div className="variable_tag global default">
                      {"{" + variable + "}"}
                    </div>
                  </Tooltip>
                );
              } else {
                return (
                  <div key={variable} className="variable_tag global">
                    {"{" + variable + "}"}{" "}
                    <span onClick={() => this.deleteGlobalVariable(variable)}>
                      <i className="fas fa-times" />
                    </span>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  global_variables: state.skills.skill.global,
  variables: state.variables.localVariables
});

const mapDispatchToProps = dispatch => {
  return {
    addVariable: variable => dispatch(pushVariable(variable)),
    setVariables: variables => dispatch(setVariables(variables)),
    updateSkill: (type, val) => dispatch(updateVersion(type, val)),
    setError: err => dispatch(setError(err))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Variables);
