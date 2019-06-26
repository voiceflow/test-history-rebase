import React from 'react';
import { Alert } from 'reactstrap';
import { lifecycle, withState } from 'recompose';

const session_warning_content = (target, takeover) => (
  <div style={{ maxWidth: 600 }} className="text-center">
    <img className="modal-img-small mb-4 mt-3" src="/warning.svg" alt="Upload" />
    <div className="modal-bg-txt mt-2">This project has another session in progress</div>
    <div className="modal-txt mt-2 mb-3">
      Temporarily for project safety, we only allow one editable version of this project to be open at a time - otherwise they may overwrite each
      other
      <br />
      This restriction will be addressed in later collaboration updates <br />
      <br />
      <span className="btn-link" onClick={takeover}>
        Takeover Current Session
      </span>
    </div>
    {target && (
      <Alert className="text-left py-4 mt-4">
        <h5>Open Session Info</h5>
        <b>Name:</b> {target.name} <br />
        <b>Email:</b> {target.email} <br />
        <b>Device:</b> {target.device.browser} on {target.device.os}
      </Alert>
    )}
  </div>
);

const connection_error = (
  <Alert color="danger" className="text-center p-4">
    <i className="fas fa-wifi-slash text-lg" />
    <br />
    <br />
    <b>Unable to Connect to Voiceflow</b>
    <br />
    Refresh your page or try again later
  </Alert>
);

export const socketCheck = lifecycle({
  componentDidMount() {
    const skill_id = this.props.computedMatch.params.skill_id;
    if (this.props.preview) {
      this.props.setLoadSession(false);
    } else {
      // SKILL SOCKET STATUS
      if (window.CreatorSocket.status !== 'FAIL') {
        window.CreatorSocket.emit('project', {
          skill_id,
        });
        window.CreatorSocket.on('occupied', (target) => {
          this.props.setErrorScreen(
            session_warning_content(target, () => {
              window.CreatorSocket.emit('takeover', {
                skill_id,
              });
              window.location.reload();
            })
          );
        });
        window.CreatorSocket.on('joined', (data) => {
          if (data === skill_id) {
            this.props.setLoadSession(false);
          }
        });
        // IF RECONNECTED RE-EMIT PROPERTY
        window.CreatorSocket.connectedCB[`SKILL_${skill_id}`] = () => {
          window.CreatorSocket.emit('project', {
            skill_id,
            reconnect: true,
          });
        };
        // IF REJOINED AND THERE IS CONFLICT - THROW WARNING
        window.CreatorSocket.on('conflict', () => {
          // eslint-disable-next-line no-console
          console.log('conflict');
        });
      } else {
        this.props.setErrorScreen(connection_error);
      }
    }
  },
  componentWillUnmount() {
    // UNMOUNT SOCKET SESSION
    delete window.CreatorSocket.connectedCB[`SKILL_${this.skill_id}`];
    window.CreatorSocket.emit('leave');
  },
});

export const errorScreen = withState('errorScreen', 'setErrorScreen', null);
export const loadSession = withState('loadSession', 'setLoadSession', true);
