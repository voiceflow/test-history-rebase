import axios from 'axios';
import Button from 'components/Button';
import { AmazonAccessToken } from 'ducks/account';
import * as _ from 'lodash';
import React, { Component } from 'react';
import { Alert } from 'reactstrap';

class Migrate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stage: 0,
      error: null,
      amzn_id: '',
    };

    this.stageHandler = this.stageHandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateSkill = this.updateSkill.bind(this);
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  componentDidMount() {
    AmazonAccessToken()
      .then(() => this.setState({ stage: 1 }))
      .catch(() =>
        this.setState({
          stage: -1,
          error: 'No Amazon Login',
        })
      );
  }

  updateSkill() {
    if (!this.state.amzn_id) return;
    axios
      .patch(`/project/${this.props.skill.project_id}/amzn_id`, { id: this.state.amzn_id.trim() })
      .then((res) => {
        this.props.updateSkill('amzn_id', res.data);
        this.setState({
          stage: 2,
        });
      })
      .catch((err) => {
        if (_.has(err, ['response', 'data'])) {
          this.setState({
            stage: -1,
            error: JSON.stringify(err.response.data),
          });
        }
      });
  }

  stageHandler() {
    switch (this.state.stage) {
      case -1:
        return (
          <>
            <Alert color="danger">{this.state.error}</Alert>
            <Button isPrimary onClick={() => this.setState({ stage: 1 })}>
              Reset
            </Button>
          </>
        );
      case 1:
        return (
          <>
            {this.props.skill && this.props.skill.amzn_id && (
              <Alert>
                Current Skill ID: <b>{this.props.skill.amzn_id}</b>
              </Alert>
            )}
            <Alert color="danger">
              Updating the Skill ID will cause Voiceflow to overwrite any existing content on the development version of the Skill on Alexa Developer
              Console
            </Alert>
            <input
              className="form-control my-3"
              name="amzn_id"
              value={this.state.amzn_id}
              onChange={this.handleChange}
              placeholder="Existing Skill ID"
            />
            <Button isPrimary onClick={this.updateSkill}>
              Update Skill Id
            </Button>
          </>
        );
      case 2:
        return <Alert>Your Project Has Been Successfully Updated</Alert>;
      default:
        return <div className="loader text-lg" />;
    }
  }

  render() {
    return (
      <div className="super-center p-5 flex-column mx-auto" style={{ maxWidth: 600 }}>
        <h1 className="mb-3">Skill Migration Tool</h1>
        {this.stageHandler()}
      </div>
    );
  }
}

export default Migrate;
