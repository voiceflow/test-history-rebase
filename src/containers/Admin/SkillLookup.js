import React from 'react';
import axios from "axios";
import moment from "moment";

import {Input, Button} from 'reactstrap';
import Toggle from 'react-toggle';
import ReactTable from 'react-table';
import {LogTable} from '../Logs';
import {toast} from 'react-toastify';

const COLUMNS = [
  {
    Header: 'ID',
    accessor: 'version_id',
    width: 60
  },
  {
    Header: 'Encoded',
    accessor: 'encoded',
    width: 110
  },
  {
    Header: 'Name',
    accessor: 'name',
    Cell: props => <div className="font-weight-bold" style={{whiteSpace: 'normal'}}>{props.value}</div>
  },
  {
    Header: 'Made',
    accessor: 'created',
    width: 100,
    Cell: props => <span>{moment(props.value).format('YYYY/MM/DD h:mm:ss a')}</span>
  },
  {
    Header: 'Amazon ID',
    accessor: 'amzn_id'
  },
  {
    Header: 'Google ID',
    accessor: 'google_id'
  },
  {
    Header: 'Creator',
    accessor: 'creator_id',
    width: 80
  },
  {
    Header: 'Live',
    accessor: 'live',
    width: 50,
    Cell: props => <div className="text-center"><span
      className={`badge badge-${props.value ? 'success' : 'danger'}`}>&nbsp;</span></div>
  }
];

class SkillLookup extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      skill_id: (props && props.match && props.match.params && props.match.params.version_id) || '',
      encoded: true,
      loading: false,
      version_info: null
    };
  }

  componentDidMount() {
    if (this.state.skill_id) {
      if (isNaN(this.state.skill_id))
        this.lookupSkill();
      else {
        // Assume that it's a number I guess
        this.setState({
          encoded: false
        }, this.lookupSkill)
      }
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  lookupSkill = () => {
    if (!this.state.skill_id) return;
    this.setState({loading: true, errors: ''});
    axios.get(`/version/${this.state.skill_id}/info`, {params: {encoded: this.state.encoded ? '1' : undefined}})
      .then((res) => {
        const v = res.data;
        v.dev_version = v.versions.find(vers => vers.version_id === v.project.dev_version);
        this.setState({
          loading: false,
          version_info: v
        });
      })
      .catch((e) => {
        this.setState({loading: false});
        console.error(e);
        toast.error("There was an error looking up this skill");
      });
  };

  render() {
    let v = this.state.version_info;
    return (
      <div className="admin-page-inner">
        <h3 className="fb_header">
          Legacy Lookup Tool <span className={'admin_highlight_emoji'}><span role="img" aria-label="old man">👨🏻‍🦳</span></span>
        </h3>
        <h5>Projects/Versions</h5>
        {this.state.loading ?
          <div className="text-center py-3">
            <div className="loader text-lg"/>
          </div> :
          <div className="">
            <label className="d-flex align-items-center">Version Id | Encoded &nbsp;&nbsp;
              <Toggle
                checked={this.state.encoded}
                onChange={() => {
                  this.setState({encoded: !this.state.encoded});
                }}
              />
            </label>
            <Input name="skill_id" value={this.state.skill_id} onChange={this.handleChange}
                   placeholder={this.state.encoded ? '86d84lrdAB' : '38728'}/>
            <Button color="primary" className="w-100 mt-3" size="lg"
                    onClick={this.lookupSkill}>Search</Button>
          </div>
        }
        <hr/>
        {v && <div>
          <label>General Info</label>
          <div><b>Version ID:</b> {v.version_id} | <b>Encoded ID:</b> {v.encoded} | <b>Dev
            Version:</b> {v.project.dev_version} | <b>Project Creator
            ID:</b> {v.project.creator_id} | <b>Project ID:</b> {v.project.project_id} </div>
          <hr/>
          {v.dev_version && <>
            <label>Dev Version</label>
            <ReactTable
              columns={COLUMNS}
              data={[v.dev_version]}
              defaultPageSize={1}
              showPagination={false}
              showPageSizeOptions={false}
            />
            <hr/>
          </>}
          <label>All Versions</label>
          <ReactTable
            defaultPageSize={5}
            columns={COLUMNS}
            data={v.versions}
          />
          <hr/>
          {v.logs.length !== 0 && <>
            <label>Errors</label>
            <LogTable logs={v.logs}/>
          </>}
        </div>}
      </div>
    )
  }

}

export default SkillLookup;
