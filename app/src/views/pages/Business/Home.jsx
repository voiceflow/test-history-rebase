import React, { Component } from 'react';
import TimeInterval from '../../components/TimeInterval'
import axios from 'axios'
import LineBar from '../../components/LineBar'
import moment from 'moment'
import ReactTable from 'react-table'
import './react-table.css'
import { Table } from 'reactstrap'

const addDays = function(date, days) {
  date.setDate(date.getDate() + days)
  return date
}

const addHours = function(date, hours) {
  date.setHours(date.getHours() + hours)
  return date
}

function getDates(start_date, stop_date, is_hour) {
  var date_array = []
  var current_date = start_date;
  while (current_date <= stop_date) {
    date_array.push(new Date (current_date))
    if(is_hour){
      current_date = addHours(current_date, 1)
    } else {
      current_date = addDays(current_date, 1)
    }
  }
  return date_array
}

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      users_data: [],
      dau: [],
      dates: [],
      users: 0,
      sessions: 0,
      interactions: 0,
      dau_loading: true,
      stats_loading: true,
      users_loading: true
    }

    this.handleFilterTypeChange = this.handleFilterTypeChange.bind(this)
    this.loadData = this.loadData.bind(this)
    this.getDAUs = this.getDAUs.bind(this)
  }

  getDAUs(filter_type) {
    let beginning = new Date()
    let end = new Date()

    if (typeof filter_type === 'object') {
      beginning = new Date(filter_type.from.getFullYear(), filter_type.from.getMonth(), filter_type.from.getDate(), 0, 0, 0)
      end = new Date(filter_type.to.getFullYear(), filter_type.to.getMonth(), filter_type.to.getDate(), 0, 0, 0)
    } else {
      // Convert to date for ez conversion to 0th hr of day
      if (filter_type === 'yd') {
        end = new Date(beginning.getFullYear(), beginning.getMonth(), beginning.getDate(), 0, 0, 0)
        beginning = new Date(beginning.getFullYear(), beginning.getMonth(), beginning.getDate() - 1, 0, 0, 0)
      } else if (filter_type === '7d') {
        beginning = new Date(beginning.getFullYear(), beginning.getMonth(), beginning.getDate() - 6, 0, 0, 0)
      } else if (filter_type === '30d') {
        beginning = new Date(beginning.getFullYear(), beginning.getMonth(), beginning.getDate() - 29, 0, 0, 0)
      } else if (filter_type === 'td') {
        beginning = new Date(beginning.getFullYear(), beginning.getMonth(), beginning.getDate(), 0, 0, 0)
      }
    }

    // Convert to unix time for comparison on backend, also keep in seconds
    let from = Math.trunc(beginning.getTime() / 1000)
    let to = Math.trunc(end.getTime() / 1000)

    axios.get(`/analytics/${this.props.skill_id}/${from}/${to}/DAU`)
      .then(res => {
        let dau = []
        let dates = []
        let date_range 
        let dau_index = 0

        // Generate range of times for the period
        date_range = getDates(beginning, end, to - from <= 259200)

        // For loop adds a 0 for any period of time that didn't have users
        for(let i=0;i < date_range.length; i++){
          if(dau_index < res.data.length && date_range[i].getTime() === new Date(res.data[dau_index].dau_date).getTime()){
            dau.push(parseInt(res.data[dau_index].user_count))
            dau_index += 1
          } else {
            dau.push(0)
          }

          if(to - from <= 259200){
            dates.push(moment(date_range[i]).format('MM-DD:HH'))
          } else {
            dates.push(date_range[i].toISOString().slice(5,10))
          }
        }

        this.setState({
          dau: dau,
          dates: dates,
          dau_loading: false
        })
      })
      .catch(err => {
        if(err){
          console.log(err) //TODO; error modal
          this.setState({
            dau: [],
            dates: [],
            dau_loading: false
          })
        }
      })
  }

  handleFilterTypeChange(val) {
    this.getDAUs(val)
  }

  loadData() {
    // Retrieve user data
    axios.get(`/analytics/${this.props.project_id}/users`)
      .then(res => {
        this.setState({
          users_data: res.data,
          users_loading: false
        })
      })
      .catch(err => {
        console.log(err) //TODO: error modal
        this.setState({
          users_data: [],
          users_loading: false
        })
      })

    axios.get(`/analytics/${this.props.project_id}`)
      .then(res => {
        this.setState({
          users: res.data.users,
          sessions: res.data.sessions,
          interactions: res.data.interactions,
          stats_loading: false
        })
      })
      .catch(err => {
        console.log(err)
        this.setState({
          users: "N/A",
          sessions: "N/A",
          interactions: "N/A",
          stats_loading: false
        })
      })

    // Retrieve todays DAUs by default
    this.getDAUs('td')
  }

  componentDidMount() {
    this.loadData()
  }

  render() {
      const columns = [{
          id: 'user',
          Header: 'User',
          accessor: d => d.user_id.slice(18, 29),
          width: 150
        }, {
          Header: 'Sessions',
          accessor: 'sessions',
          sortMethod: (a, b) => {
            if(parseInt(a) > parseInt(b)){
              return 1
            } else {
              return -1
            }
          }
        }, {
          Header: 'Interactions',
          accessor: 'utterances',
          sortMethod: (a, b) => {
            if(parseInt(a) > parseInt(b)){
              return 1
            } else {
              return -1
            }
          }
        }, {
          id: 'last_seen',
          Header: 'Last Seen',
          accessor: d => moment.unix(d.last_interaction / 1000).format('lll'),
          width: this.state.width >= 1350 ? 300 : 200,
          sortMethod: (a, b) => {
            if(new Date(a).getTime() > new Date(b).getTime()){
              return 1
            } else {
              return -1
            }
          }
        }, {
          id: 'first_seen',
          Header: 'Joined',
          accessor: d => moment.unix(d.first_interaction / 1000).format('lll'),
          width: this.state.width >= 1350 ? 300 : 200,
          sortMethod: (a, b) => {
            if(new Date(a).getTime() > new Date(b).getTime()){
              return 1
            } else {
              return -1
            }
          }
        }
      ]

    return (
      <div className="business-page-inner">
        <div className="container">
          <div className="graph-form mt-5">
            <div className="row justify-content-between">
              <div id="basic-stats-div">
                <Table borderless size="sm">
                  <tbody>
                    <tr>
                      <td><label>Users</label></td>
                      <td><label>Sessions</label></td>
                      <td><label>Interactions</label></td>
                    </tr>
                    <tr>
                      <td>{this.state.stats_loading ?
                           <span className="loader" />
                           : 
                           this.state.users}</td>
                      <td>{this.state.stats_loading ?
                           <span className="loader" />
                           :
                           this.state.sessions}</td>
                      <td>{this.state.stats_loading ?
                           <span className="loader" />
                           :
                           this.state.interactions}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              <div id="interval-div" className="d-flex">
                <label>Daily active users</label> <TimeInterval handleFilterTypeChange={this.handleFilterTypeChange} />
              </div>
            </div>
            <div className="row">
              {this.state.dau_loading ?
              <span className="loader" />
              :
              <LineBar dau={this.state.dau} dates={this.state.dates}/>
              }
            </div>
          </div>
          <div className="graph-form mt-5">
            <div className="row justify-content-center">
              <h5>User Statistics</h5>
            </div>
            <div className="row justify-content-center">
              {this.state.users_loading ?
              <span className="loader" />
              :
              <ReactTable
                className="w-100"
                data={this.state.users_data}
                columns={columns}
                defaultSorted={
                  [{
                    id: 'last_seen',
                    desc: false
                  }]
                }
              />
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Home
