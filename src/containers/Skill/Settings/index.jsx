import axios from 'axios';
import { updateDiagramRoot } from 'ducks/diagram';
import { updateVersion } from 'ducks/version';
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, ButtonGroup } from 'reactstrap';

import AdvancedSettings from './Advanced';
import BackupSettings from './Backups';
// SETTING PAGES
import BasicSettings from './Basic';
import DiscoverySettings from './Discovery';

const TABS = ['basic', 'advanced', 'discovery', 'backups'];

class Settings extends Component {
  constructor(props) {
    super(props);

    this.modalContent = this.modalContent.bind(this);
    this.switchTab = this.switchTab.bind(this);
    this.onSwapVersions = this.onSwapVersions.bind(this);
  }

  switchTab(tab) {
    const { page, history, skill_id } = this.props;

    if (tab !== page) {
      history.push(`/settings/${skill_id}/${tab}`);
    }
  }

  onSwapVersions(skill_id, is_overwrite, cb) {
    const { updateSkill, updateDiagramRoot, history } = this.props;

    axios
      .post(`/skill/${skill_id}/restore`)
      .then((res) => {
        if (!is_overwrite) {
          updateSkill('skill_id', res.data.skill_id);
          updateSkill('diagram', res.data.diagram);
        }

        if (!cb) {
          updateDiagramRoot(res.data.diagram);
          history.push(`/canvas/${res.data.skill_id}/${res.data.diagram}`);
        } else {
          // eslint-disable-next-line callback-return
          cb(true);
        }
      })
      .catch((err) => {
        console.error(err.response);
        this.setState({
          error: 'Unable to restore version',
        });

        if (cb) {
          // eslint-disable-next-line callback-return
          cb(false);
        }
      });
  }

  modalContent() {
    const { skill_id, page } = this.props;

    if (!skill_id) {
      return null;
    }

    switch (page) {
      case 'basic':
        return <BasicSettings {...this.props} onSwapVersions={this.onSwapVersions} />;
      case 'advanced':
        return <AdvancedSettings {...this.props} onSwapVersions={this.onSwapVersions} />;
      case 'discovery':
        return <DiscoverySettings {...this.props} />;
      case 'backups':
        return <BackupSettings {...this.props} onSwapVersions={this.onSwapVersions} />;
      default:
        return null;
    }
  }

  render() {
    const { page, live_mode } = this.props;

    return (
      <div className="settings pt-4 pb-5">
        <div>
          <div className="nav-bar-top mb-4">
            <ButtonGroup className="toggle-group mb-2 toggle-group-settings">
              {TABS.map((tab) => {
                return (
                  <Button
                    key={tab}
                    onClick={() => this.switchTab(tab)}
                    outline={page !== tab}
                    disabled={page === tab || (live_mode && tab === 'backups')}
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

const mapStateToProps = (state) => ({
  skill_id: state.skills.skill.skill_id,
  load_skill: state.skills.loading,
  error: state.skills.error,
});

const mapDispatchToProps = (dispatch) => {
  return {
    updateSkill: (type, val) => dispatch(updateVersion(type, val)),
    updateDiagramRoot: (val) => dispatch(updateDiagramRoot(val)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
