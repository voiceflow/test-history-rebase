import './NavBar.css';

import axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Toggle from 'react-toggle';

import { fetchDiagrams, updateDiagramRoot } from '@/ducks/diagram';
import { setLiveModeModal, toggleLive } from '@/ducks/version';

import { NavBarTabs } from './styled';

const PAGES = ['canvas', 'test', 'publish', 'analytics'];

export class SecondaryNavBar extends Component {
  state = {
    loading: false,
  };

  toggleLiveMode() {
    if (this.props.live_mode) {
      this.props.updateDiagramRoot(this.props.dev_skill.diagram);
      this.props.fetchDiagrams(this.props.dev_skill.skill_id);
      this.props.setLiveModal(false);
      this.props.toggleLive(this.props.dev_skill, this.props.dev_skill.diagram, this.props.skill_id, false).then(() => {
        this.setState({
          loading: false,
        });
        this.props.history.push(`/canvas/${this.props.dev_skill.skill_id}/${this.props.dev_skill.diagram}`);
      });
    } else {
      axios
        .get(`/skill/${this.props.live_version}`)
        .then((res) => {
          this.props.updateDiagramRoot(res.data.diagram);
          this.props.fetchDiagrams(res.data.skill_id);
          this.props.setLiveModal(true);
          this.props.toggleLive(res.data, res.data.diagram, res.data.skill_id, true).then(() => {
            this.setState({
              loading: false,
            });
            this.props.history.push(`/canvas/${res.data.skill_id}/${res.data.diagram}`);
          });
        })
        .catch((err) => {
          console.error(err);
          alert('Unable to fetch live version');
        });
    }
  }

  renderItem(page) {
    if (page === 'publish' && this.props.live_mode) {
      return (
        <Link to="" key={page} className="nav-item live-mode-disabled" onClick={(e) => e.preventDefault()}>
          {page}
        </Link>
      );
    }
    if (page === this.props.page) {
      return (
        <div key={page} className="nav-item active">
          {page}
        </div>
      );
    }
    if (this.props.skill_id) {
      let suffix = '';
      if (page === 'publish') {
        suffix = this.props.platform === 'alexa' ? '' : this.props.platform;
      } else if (page === 'analytics') {
        if (this.props.live_mode) {
          return (
            <Link to={`/tools/${this.props.skill_id}`} key={page} className="nav-item">
              {page}
            </Link>
          );
        }
        return null;
      }
      return (
        <Link to={`/${page}/${this.props.skill_id}/${suffix}`} key={page} className="nav-item">
          {page}
        </Link>
      );
    }
    return (
      <div key={page} className="nav-item">
        {page}
      </div>
    );
  }

  render() {
    return (
      <>
        <div id="secondary-nav">
          <NavBarTabs>{PAGES.map((page) => this.renderItem(page))}</NavBarTabs>
          <div id="secondary-nav-right-group">
            {this.props.amzn_id && (
              <>
                {this.props.live_version ? (
                  <>
                    {this.props.live_mode ? (
                      <div className="live-mode-text">
                        <p>Live</p>
                      </div>
                    ) : (
                      <div className="live-mode-text">
                        <p>Development</p>
                      </div>
                    )}
                    <Toggle
                      checked={this.props.live_mode}
                      icons={false}
                      onChange={() => {
                        this.setState({ loading: true });
                        this.toggleLiveMode();
                      }}
                      disabled={this.props.page !== 'canvas' || this.state.loading}
                    />
                  </>
                ) : null}
                {this.props.page === 'logs' ? (
                  <div className="nav-item">
                    <img src="/logs.svg" alt="logs" width="16" height="16" />
                  </div>
                ) : (
                  <Link to={`/creator_logs/${this.props.skill_id}`} className="nav-item">
                    <img src="/logs.svg" alt="logs" width="16" height="16" />
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
        {this.state.loading && (
          <div id="loading-diagram" style={{ zIndex: 100 }}>
            <div className="text-center">
              <h5 className="text-muted mb-2">Loading Version</h5>
              <span className="loader" />
            </div>
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  platform: state.skills.skill.platform,
  skill_id: state.skills.skill.skill_id,
  amzn_id: state.skills.skill.amzn_id,
  live_mode: state.skills.live_mode,
  live_version: state.skills.live_version,
  dev_skill: state.skills.dev_skill ? state.skills.dev_skill : state.skills.skill,
});

const mapDispatchToProps = {
  toggleLive,
  updateDiagramRoot,
  fetchDiagrams,
  setLiveModal: setLiveModeModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SecondaryNavBar);
