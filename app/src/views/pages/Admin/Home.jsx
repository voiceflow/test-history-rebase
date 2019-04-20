import React, { Component } from 'react';
import { Input, Button } from 'reactstrap'
import Toggle from 'react-toggle'
import axios from 'axios'
import ReactTable from 'react-table'
import moment from 'moment'
import { connect } from 'react-redux'

const COLUMNS = [
  {
    Header: 'ID',
    accessor: 'skill_id',
    width: 60
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
    Cell: props => <span>{moment(props.value).format('YYYY/MM/DD')}</span>
  },
  {
    Header: 'Amazon ID',
    accessor: 'amzn_id'
  },
  {
    Header: 'Vers.',
    accessor: 'version',
    width: 50
  },
  {
    Header: 'Live',
    accessor: 'live',
    width: 50,
    Cell: props => <div className="text-center"><span className={`badge badge-${props.value ? 'success' : 'danger'}`}>&nbsp;</span></div>
  }
]

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      skill_id: '',
      encoded: true,
      loading: false,
      skill_info: null
    }

    this.handleChange = this.handleChange.bind(this)
    this.lookupSkill = this.lookupSkill.bind(this)
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  lookupSkill() {
    if(!this.state.skill_id) return
    this.setState({loading: true})
    axios.get(`/version/${this.state.skill_id}/info`, {params: {encoded: this.state.encoded ? '1' : undefined}})
    .then((res) => {
      this.setState({
        loading: false,
        skill_info: res.data
      })
    })
    .catch((e) => {
      this.setState({loading: false})
      console.error(e)
      alert("Error Encountered")
    })
  }

  render() {
    let s = this.state.skill_info
    return (
      <div className="admin-page-inner">
        <div className="subheader">
          <div className="space-between">
            <span className="subheader-title">
              <b>Home</b>
              <div className="hr-label">
                <small><i className="far fa-user mr-1"></i></small>{' '}
                {this.props.user.name}{' '}
                <small><i className="far fa-chevron-right" /></small>{' '}
                <span className="text-secondary">Admin</span>
              </div>
            </span>
          </div>
        </div>
        <div className="p-5">
          <h1>Tyler's Skill Lookup Emporium</h1>
          {this.state.loading ? 
            <div className="text-center py-3"><div className="loader text-lg"/></div> : 
            <div className="">
              <label className="d-flex align-items-center">Skill Id | Encoded &nbsp;&nbsp;
                <Toggle
                  checked={this.state.encoded}
                  onChange={() => {
                    this.setState({ encoded: !this.state.encoded })
                  }}
                />
              </label>
              <Input name="skill_id" value={this.state.skill_id} onChange={this.handleChange} placeholder={this.state.encoded ? 'JROxR54aK8' : '38728' }></Input>
              <Button color="primary" className="w-100 mt-3" size="lg" onClick={this.lookupSkill}>Search</Button>
            </div>
          }
          <hr/>
          {s && <div>
            <label>General Info</label>
            <div><b>Skill ID:</b> {s.id} | <b>Encoded ID:</b> {s.encoded} | <b>Canonical:</b> {s.canonical_skill_id} | <b>Creator ID:</b> {s.skill.creator_id}</div>
            <hr/>
            <label>Skill</label>
            <ReactTable
              columns={COLUMNS}
              data={[s.skill]}
              defaultPageSize={1}
              showPagination={false}
              showPageSizeOptions={false}
            />
            <hr/>
            <label>All Versions</label>
            <ReactTable
              defaultPageSize={5}
              columns={COLUMNS}
              data={s.skills}
            />
          </div>}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.account
})

export default connect(mapStateToProps)(Home)
