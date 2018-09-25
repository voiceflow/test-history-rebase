import React, { Component } from 'react';
import User from './User';
import ReactTable from "react-table";
import ClipBoard from './../../components/ClipBoard';
import moment from 'moment'

class UserTable extends Component {

  render() {
    return (
      <ReactTable
          defaultPageSize={30}
          className="-highlight -striped"
          data = {this.props.users}
          getTrProps={(state, row) => {
            if (row && row.original && !row.original.user_id.startsWith('amzn1.ask.account')) {
              return {
                className: 'app-user'
              }
            }else{
              return {}
            }
          }}
          columns= {[{
              Header: "ID",
              accessor: "id",
              className: "pl-3",
              maxWidth: 80
          }, {
              Header: "Email",
              accessor: "email",
              Cell: row => {
                  return <ClipBoard
                      id={"email" + row.original.id}
                      value={row.value}
                  />
              }
          }, {
              Header: "First Name",
              accessor: "first_name"
          }, {
              Header: "Rate",
              accessor: "completion",
              className: "text-center",
              maxWidth: 100,
              style: {backgroundColor: "#C8E6C9"}
          }, {
              Header: "Started",
              accessor: "count",
              className: "text-center",
              maxWidth: 100,
          },{
              Header: "Finished",
              accessor: "finished",
              className: "text-center",
              maxWidth: 100,
          }, {
              Header: "Sessions",
              accessor: "sessions",
              className: "text-center",
              maxWidth: 100
          }, {
              Header: "Utterances",
              accessor: "utterances",
              className: "text-center",
              maxWidth: 100
          }, {
              Header: "Last Story",
              accessor: "last_seen",
              className: "text-center",
              Cell: row => {
                  if(row.value){
                      return moment(row.value).fromNow();
                  }else{
                      return "unknown";
                  }
              },
          }, {
              Header: "Joined",
              accessor: "join_date",
              className: "text-center",
              Cell: row => {
                  if(row.value){
                      return moment(row.value).fromNow();
                  }else{
                      return "unknown";
                  }
              },
          }]}
          SubComponent={(row) => {
              row = row.original;
              return <User
                  id={row.user_id}
                  env={this.props.env}
              />
          }}
      />
    );
  }
}

export default UserTable;