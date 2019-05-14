import React, { Component } from 'react'
import _ from 'lodash'
import axios from 'axios/index'
import { ButtonGroup, Button } from 'reactstrap'
import { connect } from 'react-redux'
import { updateVersion } from 'ducks/version'
import { updateDiagramRoot } from 'ducks/diagram'

// SETTING PAGES
import BasicAdvancedSettings from './BasicAdvanced'
import DiscoverySettings from './Discovery'
import BackupSettings from './Backups'

const TABS = ['basic', 'advanced', 'discovery', 'backups']

class Settings extends Component {
  constructor(props) {
    super(props);

    this.modalContent = this.modalContent.bind(this);
    this.switchTab = this.switchTab.bind(this);
    this.onSwapVersions = this.onSwapVersions.bind(this)
  }

  switchTab(tab) {
    if (tab !== this.props.page) {
      this.props.history.push(`/settings/${this.props.skill_id}/${tab}`);
    }
  }

  onSwapVersions(skill_id, is_overwrite, cb) {
    axios.post(`/skill/${skill_id}/restore`)
      .then(res => {
        if (!is_overwrite) {
          this.props.updateSkill("skill_id", res.data.skill_id);
          this.props.updateSkill("diagram", res.data.diagram);
        }

        if (!cb) {
          this.props.updateDiagramRoot(res.data.diagram)
          this.props.history.push(
            `/canvas/${res.data.skill_id}/${res.data.diagram}`
          );
        } else {
          cb(true);
        }
      })
      .catch(err => {
        console.error(err.response);
        this.setState({
          error: "Unable to restore version"
        });

        if (cb) {
          cb(false);
        }
      });
  }

  modalContent() {
    if (!this.props.skill_id) {
      return null;
    }

    switch (this.props.page) {
      case "basic":
      case "advanced":
        return <BasicAdvancedSettings {...this.props} onSwapVersions={this.onSwapVersions}/>;
      case "discovery":
        return <DiscoverySettings {...this.props}/>;
      case "backups":
        return <BackupSettings {...this.props} onSwapVersions={this.onSwapVersions}/>;
      default:
        return null;
    }
  }

  render() {
    return (
      <div className="settings pt-4 pb-5">
        <div>
        <div className="nav-bar-top mb-4">
          <ButtonGroup className="toggle-group mb-2 toggle-group-settings">
            {TABS.map(tab => {
              return (
                <Button
                  key={tab}
                  onClick={() => this.switchTab(tab)}
                  outline={this.props.page !== tab}
                  disabled={
                    this.props.page === tab ||
                    (this.props.live_mode && tab === "backups")
                  }
                >
                  {_.startCase(tab)}
                </Button>
              );
            })}
          </ButtonGroup>
        </div>
        </div>
        {this.modalContent()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
    skill_id: state.skills.skill.skill_id,
    load_skill: state.skills.loading,
    error: state.skills.error,
})

const mapDispatchToProps = dispatch => {
    return {
        updateSkill: (type, val) => dispatch(updateVersion(type, val)),
        updateDiagramRoot: (val) => dispatch(updateDiagramRoot(val))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Settings)
