import axios from 'axios';
import React from 'react';

import InfoText from '@/components/InfoText';
import { activeSkillIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { activeProjectSelector } from '@/store/selectors';

import LogTable from './components/LogTable';

class Logs extends React.PureComponent {
  state = {
    response: '',
    logs: [],
    name: '',
  };

  onLoad() {
    const { skillID } = this.props;

    axios
      .get(`/logs/${skillID}`)
      .then((res) => {
        this.setState({
          logs: res.data,
        });
      })
      .catch((err) => {
        this.setState({
          error: err,
        });
      });
  }

  componentDidMount() {
    this.onLoad();
  }

  render() {
    const { project } = this.props;
    const { logs } = this.state;

    return (
      <div className="px-5 justify-content-start">
        <h5 className="pt-4">
          <b>{project.name}</b> Error Logs
        </h5>
        <hr />
        {logs.length > 0 ? <LogTable logs={logs} /> : <InfoText>Your skill hasn't encountered any errors yet</InfoText>}
      </div>
    );
  }
}

const mapStateToProps = {
  skillID: activeSkillIDSelector,
  project: activeProjectSelector,
};

export default connect(mapStateToProps)(Logs);
