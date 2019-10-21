import axios from 'axios';
import cn from 'classnames';
import moment from 'moment';
import React, { Component } from 'react';
import { Alert, FormGroup, Label, Table } from 'reactstrap';

import Button from '@/components/Button';
import { Spinner } from '@/components/Spinner';
import { setConfirm, setError } from '@/ducks/modal';
import { goToCanvas } from '@/ducks/router';
import { activeProjectIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';

class BackupSettings extends Component {
  state = {
    preview: false,
    loading: true,
    curr_preview: {
      created: new Date(),
    },
    versions: [],
    live_version: null,
  };

  componentDidMount = async () => {
    const { projectID, setError } = this.props;

    try {
      const [req1, req2] = await Promise.all([axios.get(`/project/${projectID}/live_version`), axios.get(`/project/${projectID}/versions`)]);

      const liveVersion = req1.data;
      const versions = req2.data.filter((version) => {
        return version.skill_id !== liveVersion.live_version;
      });

      this.setState({
        loading: false,
        versions,
        live_version: liveVersion.live_skill,
        live_version_id: liveVersion.live_version,
      });
    } catch (err) {
      this.setState({
        loading: false,
      });
      setError('Unable to Fetch Backup Versions');
    }
  };

  previewBackup = (version) => {
    this.setState({
      preview: true,
      curr_preview: version,
    });
  };

  confirmRestore = (versionId) => {
    const { setConfirm } = this.props;
    setConfirm({
      warning: true,
      text:
        "This action can not be undone, will delete all your current work since your last backup, and will not change your skill's Amazon endpoint.",
      confirm: () => this.swapVersions(versionId),
    });
  };

  swapVersions = async (versionId) => {
    const { setError, toggle, setConfirm, goToCanvas } = this.props;

    try {
      const { data } = await axios.post(`/skill/${versionId}/restore`);
      setConfirm({
        text: 'Successfully Restored Backup',
      });
      toggle();
      goToCanvas(data.skill_id, data.diagram);
    } catch (err) {
      console.error(err.response);
      setError('Unable to restore version');
    }
  };

  renderBackups = () => {
    const { loading, versions, live_version, live_version_id } = this.state;
    if (loading) {
      return (
        <div className="mt-5">
          <Spinner name="Backup Versions" />
        </div>
      );
    }

    if ((!Array.isArray(versions) || versions.length === 0) && !live_version) {
      return (
        <Alert color="warning" className="mb-0">
          There are currently no backups for this skill
          <br />
          Backups are generated every time when you upload your skill
        </Alert>
      );
    }

    return (
      <>
        <div id="backup">
          <Table>
            <thead>
              <tr>
                <th>
                  <label>Saved</label>
                </th>
                <th>
                  <label>Platform</label>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {live_version ? (
                <tr className="table-primary">
                  <td>
                    {moment(live_version.created).fromNow()} <br /> (Current live version)
                  </td>
                  <td>
                    <i
                      className={cn('fab', {
                        'fa-google': live_version.published_platform === 'google',
                        'fa-amazon': live_version.published_platform !== 'google',
                      })}
                    />
                  </td>
                  <td className="text-right">
                    <Button isPrimary onClick={() => this.confirmRestore(live_version_id)}>
                      Restore
                    </Button>
                  </td>
                </tr>
              ) : null}
              {versions.map((version, i) => {
                return (
                  <tr key={i}>
                    <td>{moment(version.created).fromNow()}</td>
                    <td>
                      <i
                        className={cn('fab', {
                          'fa-google': version.published_platform === 'google',
                          'fa-amazon': version.published_platform !== 'google',
                        })}
                      />
                    </td>
                    <td className="text-right">
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
      </>
    );
  };

  render() {
    return (
      <>
        <div className="settings-content settings-backups clearfix mt-4">
          <FormGroup>
            <Label>Backups</Label>
            <div className="helper-text mb-2">
              Restore your skill to previous versions. A version is saved every time you upload your skill to Alexa
            </div>
          </FormGroup>
        </div>
        {this.renderBackups()}
      </>
    );
  }
}

const mapStateToProps = {
  projectID: activeProjectIDSelector,
};

const mapDispatchToProps = {
  setConfirm,
  goToCanvas,
  setError,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BackupSettings);
