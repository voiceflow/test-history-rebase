/* eslint no-restricted-globals: ["error", "isFinite"] */
import './react-table.css';

import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import ReactTable from 'react-table-6';
import { Button, Input } from 'reactstrap';

import { AdminTitle } from '@/admin/styles';
import { Spinner } from '@/components/Spinner';
import { toast } from '@/components/Toast';

const COLUMNS = [
  {
    Header: 'ID',
    accessor: '_id',
    width: 250,
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
    width: 200,
    // eslint-disable-next-line react/display-name
    Cell: (props) => <span>{moment(props.value).format('YYYY/MM/DD h:mm:ss a')}</span>,
  },
  {
    Header: 'Creator',
    accessor: 'creatorID',
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
      loading: false,
      project: null,
      versions: [],
      projectID: _.get(props, ['match', 'params', 'project_id']) || '',
    };
  }

  componentDidMount() {
    if (this.state.projectID) {
      this.lookupSkill();
    }
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  lookupSkill = async () => {
    if (!this.state.projectID) {
      return;
    }

    this.setState({ loading: true, errors: '', project: null, versions: [] });

    try {
      const {
        data: { project, versions },
      } = await axios.get(`/admin-api/projects/${this.state.projectID}`);

      this.setState({ loading: false, project, versions });
    } catch (err) {
      this.setState({ loading: false, project: null, versions: [] });
      console.error(err);
      toast.error('There was an error looking up this skill');
    }
  };

  render() {
    const { project, versions, loading } = this.state;

    const devVersion = versions.find(({ _id }) => _id === project.devVersion);

    return (
      <>
        <AdminTitle>
          Legacy Lookup Tool (Deprecated)
          <span className="admin_highlight_emoji">
            <span role="img" aria-label="old man">
              👨🏻‍🦳
            </span>
          </span>
        </AdminTitle>

        <hr />

        <h5>Projects/Versions</h5>

        {loading ? (
          <Spinner isEmpty />
        ) : (
          <div>
            <Input name="projectID" value={this.state.projectID} onChange={this.handleChange} placeholder="86d84lrdAB" />
            <Button color="primary" className="w-100 mt-3" size="lg" onClick={this.lookupSkill}>
              Search
            </Button>
          </div>
        )}
        <hr />
        {!!project && (
          <div>
            <h5>General Info</h5>
            <dl>
              <dt>Project ID:</dt>
              <dd>{project._id}</dd>
              <dt>Project Creator ID:</dt>
              <dd>{project.creatorID}</dd>
              <dt>Platform:</dt>
              <dd>{project.platform}</dd>
              <dt>Dev Version:</dt>
              <dd>{project.devVersion}</dd>
            </dl>

            <br />
            <hr />
            <br />

            {!!devVersion && (
              <>
                <h5>Dev Version</h5>
                <ReactTable columns={COLUMNS} data={[devVersion]} defaultPageSize={1} showPagination={false} showPageSizeOptions={false} />
                <br />
                <hr />
                <br />
              </>
            )}

            <h5>All Versions</h5>

            <ReactTable defaultPageSize={5} columns={COLUMNS} data={versions} />

            {!!project.members?.length && (
              <>
                <br />
                <hr />
                <br />
                <h5>Members</h5>
                <ReactTable
                  defaultPageSize={5}
                  columns={[
                    {
                      Header: 'Creator',
                      accessor: 'creatorID',
                    },
                    {
                      Header: 'Platform Data',
                      accessor: 'platformData',
                      Cell: (props) => <span>{JSON.stringify(props.value ?? {})}</span>,
                    },
                  ]}
                  data={project.members}
                />
              </>
            )}
          </div>
        )}
      </>
    );
  }
}

export default SkillLookup;
