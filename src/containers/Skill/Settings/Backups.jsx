import axios from 'axios';
import cn from 'classnames';
import Button from 'components/Button';
import { setConfirm } from 'ducks/modal';
import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert, FormGroup, Label, Modal, ModalFooter, Table } from 'reactstrap';

import LightCanvas from '../../Canvas/LightCanvas';

class BackupSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      preview: false,
      loading: true,
      curr_preview: {
        created: new Date(),
      },
      versions: [],
      live_version: null,
    };

    this.confirmRestore = this.confirmRestore.bind(this);
    this.previewBackup = this.previewBackup.bind(this);
  }

  componentDidMount() {
    const { skill } = this.props;
    try {
      const load_promises = [];

      load_promises.push(axios.get(`/project/${skill.project_id}/live_version`));
      load_promises.push(axios.get(`/project/${skill.project_id}/versions`));

      Promise.all(load_promises)
        .then((res) => {
          const live_version = res[0].data;
          const versions = res[1].data.filter((version) => {
            return version.skill_id !== live_version.live_version;
          });

          this.setState({
            loading: false,
            versions,
            live_version: live_version.live_skill,
          });
        })
        .catch(() => {
          this.setState({
            loading: false,
            error: 'Unable to load versions',
          });
        });
    } catch (err) {
      this.setState({
        loading: false,
        error: 'Unable to load versions',
      });
    }
  }

  previewBackup(version) {
    this.setState({
      preview: true,
      curr_preview: version,
    });
  }

  confirmRestore(skill_id) {
    const { setConfirm, onSwapVersions } = this.props;
    setConfirm({
      warning: true,
      text: (
        <Alert color="danger" className="mb-0">
          WARNING: This action can not be undone, will delete all your current work since your last backup, and will not change your skill's Amazon
          endpoint.
        </Alert>
      ),
      confirm: onSwapVersions,
      params: [skill_id],
    });
  }

  render() {
    const { loading, versions, live_version, curr_preview, preview } = this.state;
    if (loading) {
      return <div className="s__loading_symbol">Loading...</div>;
    }

    if ((!Array.isArray(versions) || versions.length === 0) && !live_version) {
      return (
        <div className="settings-content clearfix">
          <Alert color="warning" className="mb-0">
            There are currently no backups for this skill
            <br />
            Backups are generated every time when you upload your skill
          </Alert>
        </div>
      );
    }

    return (
      <React.Fragment>
        {/* Modal for previewing backups */}
        <Modal isOpen={preview} size="xl" toggle={() => this.setState({ preview: false })} className="light-canvas-modal">
          <div id="light-canvas-wrap">
            <div className="no-select" id="PreviewBar">
              <h3 className="font-weight-light">{moment(curr_preview.created).fromNow()}</h3>
            </div>
            <LightCanvas diagram_id={curr_preview.diagram} />
          </div>
          <Button className="goback-btn position-absolute" onClick={() => this.setState({ preview: false })} style={{ top: 320, left: -90 }} />

          <ModalFooter>
            <Button isPrimary className="ml-auto mr-auto" onClick={() => this.confirmRestore(curr_preview.skill_id)}>
              Restore
            </Button>
          </ModalFooter>
        </Modal>

        <React.Fragment>
          <div className="settings-content settings-backups clearfix">
            <FormGroup>
              <Label>Backups</Label>
              <div className="helper-text mb-2">
                Restore your skill to previous versions. A version is saved every time you upload your skill to Alexa
              </div>
              <div id="backup">
                <Table>
                  <thead>
                    <tr>
                      <th>
                        <label className="text-left">Saved</label>
                      </th>
                      <th>
                        <label className="text-left">Platform</label>
                      </th>
                      <th>
                        <label className="text-left ml-4">Preview</label>
                      </th>
                      <th>
                        <label className="text-left">Restore</label>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {live_version ? (
                      <tr className="table-primary">
                        <td>
                          {moment(live_version.created).fromNow()} <br /> (Current live version)
                        </td>
                        <td className="text-center">
                          <i
                            className={cn('fab', {
                              'fa-google': live_version.published_platform === 'google',
                              'fa-amazon': live_version.published_platform !== 'google',
                            })}
                          />
                        </td>
                        <td>
                          <Button isPrimary onClick={() => this.previewBackup(live_version)}>
                            Preview
                          </Button>
                        </td>
                        <td>
                          <Button isPrimary onClick={() => this.confirmRestore(live_version.skill_id)}>
                            Restore
                          </Button>
                        </td>
                      </tr>
                    ) : null}
                    {versions.map((version, i) => {
                      return (
                        <tr key={i}>
                          <td>{moment(version.created).fromNow()}</td>
                          <td className="text-center">
                            <i
                              className={cn('fab', {
                                'fa-google': version.published_platform === 'google',
                                'fa-amazon': version.published_platform !== 'google',
                              })}
                            />
                          </td>
                          <td>
                            <Button isFlat onClick={() => this.previewBackup(version)}>
                              Preview
                            </Button>
                          </td>
                          <td>
                            <Button isPrimarySmall onClick={() => this.confirmRestore(version.skill_id)}>
                              Restore
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </FormGroup>
          </div>
        </React.Fragment>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.account,
  team: state.team.byId[state.team.team_id],
});

const mapDispatchToProps = (dispatch) => {
  return {
    setConfirm: (confirm) => dispatch(setConfirm(confirm)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BackupSettings);
