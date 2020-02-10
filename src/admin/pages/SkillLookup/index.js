/* eslint no-restricted-globals: ["error", "isFinite"] */
import '@/pages/Business/react-table.css';

import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import ReactTable from 'react-table';
import { Button, Input } from 'reactstrap';

import { AdminTitle } from '@/admin/styles';
import { Spinner } from '@/components/Spinner';
import { toast } from '@/components/Toast';
import Toggle from '@/components/Toggle';

import LogTable from '../Logs/components/LogTable';

const COLUMNS = [
  {
    Header: 'ID',
    accessor: 'version_id',
    width: 60,
  },
  {
    Header: 'Encoded',
    accessor: 'encoded',
    width: 110,
  },
  {
    Header: 'Name',
    accessor: 'name',
    // eslint-disable-next-line react/display-name
    Cell: (props) => (
      <div className="font-weight-bold" style={{ whiteSpace: 'normal' }}>
        {props.value}
      </div>
    ),
  },
  {
    Header: 'Made',
    accessor: 'created',
    width: 100,
    // eslint-disable-next-line react/display-name
    Cell: (props) => <span>{moment(props.value).format('YYYY/MM/DD h:mm:ss a')}</span>,
  },
  {
    Header: 'Amazon ID',
    accessor: 'amzn_id',
  },
  {
    Header: 'Google ID',
    accessor: 'google_id',
  },
  {
    Header: 'Creator',
    accessor: 'creator_id',
    width: 80,
  },
  {
    Header: 'Live',
    accessor: 'live',
    width: 50,
    // eslint-disable-next-line react/display-name
    Cell: (props) => (
      <div className="text-center">
        <span className={`badge badge-${props.value ? 'success' : 'danger'}`}>&nbsp;</span>
      </div>
    ),
  },
];

class SkillLookup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      versionID: _.get(props, ['match', 'params', 'version_id']) || '',
      encoded: true,
      loading: false,
      versionInfo: null,
    };
  }

  componentDidMount() {
    if (this.state.versionID) {
      if (isNaN(this.state.versionID)) this.lookupSkill();
      else {
        // Assume that it's a number I guess
        this.setState(
          {
            encoded: false,
          },
          this.lookupSkill
        );
      }
    }
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  lookupSkill = () => {
    if (!this.state.versionID) return;
    this.setState({ loading: true, errors: '' });
    axios
      .get(`/version/${this.state.versionID}/info`, { params: { encoded: this.state.encoded ? '1' : undefined } })
      .then((res) => {
        const v = res.data;
        v.dev_version = v.versions.find((vers) => vers.version_id === v.project.dev_version);
        this.setState({
          loading: false,
          versionInfo: v,
        });
      })
      .catch((e) => {
        this.setState({ loading: false });
        console.error(e);
        toast.error('There was an error looking up this skill');
      });
  };

  render() {
    const v = this.state.versionInfo;
    return (
      <>
        <AdminTitle>
          Legacy Lookup Tool{' '}
          <span className="admin_highlight_emoji">
            <span role="img" aria-label="old man">
              👨🏻‍🦳
            </span>
          </span>
        </AdminTitle>
        <hr />

        <h5>Projects/Versions</h5>
        {this.state.loading ? (
          <Spinner isEmpty />
        ) : (
          <div className="">
            <label className="d-flex align-items-center">
              Version Id | Encoded &nbsp;&nbsp;
              <Toggle
                checked={this.state.encoded}
                onChange={() => {
                  this.setState({ encoded: !this.state.encoded });
                }}
              />
            </label>
            <Input
              name="versionID"
              value={this.state.versionID}
              onChange={this.handleChange}
              placeholder={this.state.encoded ? '86d84lrdAB' : '38728'}
            />
            <Button color="primary" className="w-100 mt-3" size="lg" onClick={this.lookupSkill}>
              Search
            </Button>
          </div>
        )}
        <hr />
        {v && (
          <div>
            <label>General Info</label>
            <div>
              <b>Version ID:</b> {v.version_id} | <b>Encoded ID:</b> {v.encoded} | <b>Dev Version:</b> {v.project.dev_version} |{' '}
              <b>Project Creator ID:</b> {v.project.creator_id} | <b>Project ID:</b> {v.project.project_id}{' '}
            </div>
            <hr />
            {v.dev_version && (
              <>
                <label>Dev Version</label>
                <ReactTable columns={COLUMNS} data={[v.dev_version]} defaultPageSize={1} showPagination={false} showPageSizeOptions={false} />
                <hr />
              </>
            )}
            <label>All Versions</label>
            <ReactTable defaultPageSize={5} columns={COLUMNS} data={v.versions} />
            <hr />
            {v.logs.length !== 0 && (
              <>
                <label>Errors</label>
                <LogTable logs={v.logs} />
              </>
            )}
          </div>
        )}
      </>
    );
  }
}

export default SkillLookup;
